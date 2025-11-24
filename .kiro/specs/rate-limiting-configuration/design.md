# Design Document - Rate Limiting Configuration

## Overview

Este documento describe el diseño de la configuración de rate limiting para el boilerplate de NestJS. La implementación utiliza el módulo `@nestjs/throttler` que ya está instalado en el proyecto, y se enfoca en proporcionar una configuración robusta, flexible y bien documentada que proteja la API contra uso abusivo mientras permite personalización por endpoint.

El diseño aprovecha la configuración existente en `AppModule` y `main.middleware.ts`, mejorándola con guards globales, decoradores personalizados y documentación completa.

## Architecture

### High-Level Architecture

```mermaid
graph TD
    A[Cliente HTTP] -->|Request| B[NestJS Application]
    B --> C[ThrottlerGuard Global]
    C -->|Verifica límites| D{¿Excede límite?}
    D -->|Sí| E[HTTP 429 Response]
    D -->|No| F[Controller/Endpoint]
    F -->|@SkipThrottle?| G{¿Skip?}
    G -->|Sí| H[Procesar sin límite]
    G -->|No| I{¿@Throttle custom?}
    I -->|Sí| J[Aplicar límite custom]
    I -->|No| K[Aplicar límite global]
    J --> L[Procesar Request]
    K --> L
    H --> L
    L --> M[Response]
```

### Component Interaction

1. **ThrottlerModule**: Configurado en `AppModule` con valores desde variables de entorno
2. **ThrottlerGuard**: Aplicado globalmente en `main.middleware.ts` para proteger todos los endpoints
3. **Decoradores**: `@SkipThrottle` y `@Throttle` para personalización a nivel de controlador/endpoint
4. **ConfigService**: Proporciona valores de configuración desde `.env`

## Components and Interfaces

### 1. ThrottlerModule Configuration (app.module.ts)

**Responsabilidad**: Configurar el módulo de throttling con valores desde variables de entorno

**Configuración actual**:
```typescript
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      ttl: config.get('THROTTLE_TTL'),
      limit: config.get('THROTTLE_LIMIT')
    }
  ]
})
```

**Mejoras propuestas**:
- Agregar valores por defecto seguros
- Validar tipos de datos
- Soportar múltiples configuraciones (short-term y long-term)

**Nueva configuración**:
```typescript
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      name: 'short',
      ttl: Number(config.get('THROTTLE_TTL', 60000)), // 1 minuto por defecto
      limit: Number(config.get('THROTTLE_LIMIT', 10))
    },
    {
      name: 'long',
      ttl: Number(config.get('THROTTLE_LONG_TTL', 3600000)), // 1 hora por defecto
      limit: Number(config.get('THROTTLE_LONG_LIMIT', 100))
    }
  ]
})
```

### 2. ThrottlerGuard Global (main.middleware.ts)

**Responsabilidad**: Aplicar rate limiting a todos los endpoints de la aplicación

**Implementación**:
```typescript
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// En AppModule providers:
{
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
```

**Alternativa en middleware** (actualmente comentada):
```typescript
app.useGlobalGuards(new ThrottlerGuard(app.get(Reflector)));
```

**Decisión de diseño**: Usar `APP_GUARD` en providers es preferible porque:
- Mejor integración con el sistema de inyección de dependencias
- Más fácil de testear
- Permite override en módulos específicos

### 3. Decoradores para Personalización

#### @SkipThrottle

**Uso**: Excluir endpoints del rate limiting

**Ejemplos**:
```typescript
// Excluir controlador completo
@SkipThrottle()
@Controller('health')
export class HealthController { }

// Excluir endpoint específico
@Controller('users')
export class UsersController {
  @SkipThrottle()
  @Get('public')
  getPublicData() { }
  
  @Get('private')
  getPrivateData() { } // Sí tiene rate limiting
}

// Excluir solo de una configuración específica
@SkipThrottle({ short: true })
@Get('endpoint')
someEndpoint() { } // Solo aplica límite 'long'
```

#### @Throttle

**Uso**: Configurar límites personalizados por endpoint

**Ejemplos**:
```typescript
// Límite más restrictivo para endpoint costoso
@Throttle({ short: { ttl: 60000, limit: 3 } })
@Post('expensive-operation')
expensiveOperation() { }

// Múltiples límites
@Throttle({ 
  short: { ttl: 60000, limit: 5 },
  long: { ttl: 3600000, limit: 50 }
})
@Post('create')
create() { }
```

### 4. Variables de Entorno

**Archivo**: `.env` y `.env.template`

**Variables existentes**:
```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
```

**Variables adicionales propuestas**:
```env
# Rate Limiting - Short Term (por minuto)
THROTTLE_TTL=60000          # 60 segundos
THROTTLE_LIMIT=10           # 10 peticiones por minuto

# Rate Limiting - Long Term (por hora)
THROTTLE_LONG_TTL=3600000   # 1 hora
THROTTLE_LONG_LIMIT=100     # 100 peticiones por hora
```

### 5. Response Headers

El ThrottlerGuard automáticamente agrega headers informativos:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1234567890
```

### 6. Error Response

Cuando se excede el límite:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Data Models

### ThrottlerOptions Interface

```typescript
interface ThrottlerOptions {
  name?: string;      // Identificador de la configuración
  ttl: number;        // Time to live en milisegundos
  limit: number;      // Número máximo de peticiones
}
```

### ThrottlerModuleOptions

```typescript
interface ThrottlerModuleOptions {
  throttlers: ThrottlerOptions[];
  skipIf?: (context: ExecutionContext) => boolean;
  ignoreUserAgents?: RegExp[];
  storage?: ThrottlerStorage;
}
```

## Error Handling

### 1. Límite Excedido

**Código**: 429 Too Many Requests

**Respuesta**:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Headers**:
- `X-RateLimit-Limit`: Límite configurado
- `X-RateLimit-Remaining`: Peticiones restantes (0)
- `X-RateLimit-Reset`: Timestamp cuando se resetea el contador
- `Retry-After`: Segundos hasta que se puede reintentar

### 2. Configuración Inválida

**Escenario**: Variables de entorno con valores no numéricos

**Solución**: Usar `Number()` con valores por defecto

```typescript
ttl: Number(config.get('THROTTLE_TTL', 60000)) || 60000
```

### 3. Endpoints Excluidos

Los endpoints con `@SkipThrottle()` no generan errores 429 y no consumen del límite.

## Testing Strategy

### 1. Unit Tests

**Objetivo**: Verificar configuración del módulo

```typescript
describe('ThrottlerModule Configuration', () => {
  it('should load configuration from environment variables', () => {
    // Test que ConfigService proporciona valores correctos
  });
  
  it('should use default values when env vars are missing', () => {
    // Test valores por defecto
  });
});
```

### 2. Integration Tests

**Objetivo**: Verificar comportamiento del rate limiting

```typescript
describe('Rate Limiting (e2e)', () => {
  it('should return 429 when limit is exceeded', async () => {
    // Hacer 11 peticiones y verificar que la 11va retorna 429
  });
  
  it('should skip rate limiting for @SkipThrottle endpoints', async () => {
    // Hacer múltiples peticiones a endpoint excluido
  });
  
  it('should apply custom limits with @Throttle', async () => {
    // Verificar límites personalizados
  });
  
  it('should include rate limit headers in response', async () => {
    // Verificar headers X-RateLimit-*
  });
  
  it('should reset counter after TTL expires', async () => {
    // Esperar TTL y verificar reset
  });
});
```

### 3. E2E Tests

**Objetivo**: Verificar comportamiento en escenarios reales

- Test de múltiples clientes simultáneos
- Test de diferentes endpoints con diferentes límites
- Test de recuperación después de exceder límite

## Implementation Notes

### Orden de Implementación

1. **Actualizar AppModule**: Mejorar configuración de ThrottlerModule con valores por defecto y múltiples throttlers
2. **Configurar Guard Global**: Agregar ThrottlerGuard como APP_GUARD en providers
3. **Actualizar Variables de Entorno**: Agregar variables para long-term limiting
4. **Documentar Uso**: Crear ejemplos en README de cómo usar @SkipThrottle y @Throttle
5. **Agregar Tests**: Implementar tests de integración para verificar comportamiento

### Consideraciones de Seguridad

1. **Valores por Defecto Seguros**: Límites conservadores para prevenir abuso
2. **No Exponer Información Sensible**: Los mensajes de error no deben revelar detalles internos
3. **Logging**: Considerar logging de intentos de exceder límites para detectar ataques
4. **IP-based Limiting**: El throttler por defecto usa IP del cliente

### Consideraciones de Performance

1. **Storage**: Por defecto usa memoria, considerar Redis para producción con múltiples instancias
2. **Overhead**: El guard agrega mínimo overhead (~1-2ms por request)
3. **Escalabilidad**: Para múltiples instancias, usar storage compartido

### Mejoras Futuras (Fuera del Scope Actual)

1. **Redis Storage**: Para aplicaciones distribuidas
2. **Custom Key Generator**: Rate limiting por usuario autenticado en lugar de IP
3. **Dynamic Configuration**: Ajustar límites sin reiniciar la aplicación
4. **Metrics**: Integrar con sistema de métricas para monitorear rate limiting
5. **Custom Exception Filter**: Personalizar respuestas de error 429

## Configuration Examples

### Desarrollo
```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_LONG_TTL=3600000
THROTTLE_LONG_LIMIT=1000
```

### Producción
```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
THROTTLE_LONG_TTL=3600000
THROTTLE_LONG_LIMIT=100
```

### Testing
```env
THROTTLE_TTL=1000
THROTTLE_LIMIT=5
THROTTLE_LONG_TTL=10000
THROTTLE_LONG_LIMIT=20
```
