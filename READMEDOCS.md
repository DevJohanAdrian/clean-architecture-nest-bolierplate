# 📚 Documentación del Backend - NestJS Boilerplate

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Implementadas](#-características-implementadas)
- [Uso y Desarrollo](#-uso-y-desarrollo)
- [Testing](#-testing)
- [Docker](#-docker)
- [Rate Limiting](#️-rate-limiting)
- [Buenas Prácticas](#-buenas-prácticas)
- [Scripts Disponibles](#-scripts-disponibles)
- [Roadmap](#-roadmap)

---

## 🎯 Descripción General

Este es un **boilerplate profesional de NestJS** diseñado para acelerar el desarrollo de aplicaciones backend escalables y mantenibles. Incluye configuraciones pre-establecidas para seguridad, testing, logging, documentación API y despliegue con Docker.

**Versión:** 0.0.5  
**Autor:** DevJohanAdrian  
**Licencia:** MIT

### Características Principales

✅ Arquitectura modular y escalable  
✅ TypeScript con configuración estricta  
✅ Base de datos PostgreSQL con TypeORM  
✅ Documentación automática con Swagger  
✅ Testing con Vitest (Unit + E2E)  
✅ Seguridad implementada (Helmet, CORS, Rate Limiting)  
✅ Logger personalizado con Winston  
✅ Docker y Docker Compose configurados  
✅ Git hooks con Husky y Conventional Commits  
✅ Validación de datos con class-validator  
✅ Versionamiento de API

---

## 🏗️ Arquitectura

### Patrón Arquitectónico

El proyecto implementa una **Arquitectura Modular en Capas** siguiendo los principios de NestJS:

```
┌─────────────────────────────────────────┐
│         Controllers Layer               │  ← Manejo de HTTP requests
├─────────────────────────────────────────┤
│         Services Layer                  │  ← Lógica de negocio
├─────────────────────────────────────────┤
│         Repository Layer (TypeORM)      │  ← Acceso a datos
├─────────────────────────────────────────┤
│         Database (PostgreSQL)           │  ← Persistencia
└─────────────────────────────────────────┘
```

### Principios Aplicados

- **Separation of Concerns**: Cada capa tiene responsabilidades bien definidas
- **Dependency Injection**: Inyección de dependencias nativa de NestJS
- **Modularidad**: Módulos independientes y reutilizables
- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **DRY (Don't Repeat Yourself)**: Código compartido en módulos comunes

---

## 🛠️ Stack Tecnológico

### Core Framework
- **NestJS** v10.0.0 - Framework backend progresivo
- **TypeScript** v5.1.3 - Superset tipado de JavaScript
- **Node.js** >=22.x - Runtime de JavaScript
- **Express** - Plataforma web subyacente

### Base de Datos
- **PostgreSQL** 14.15 - Base de datos relacional
- **TypeORM** v0.3.20 - ORM para TypeScript
- **pg** v8.13.1 - Driver de PostgreSQL

### Seguridad
- **Helmet** v8.0.0 - Protección de headers HTTP
- **@nestjs/throttler** v6.2.1 - Rate limiting
- **CORS** - Control de acceso entre orígenes
- **class-validator** v0.14.1 - Validación de DTOs

### Documentación
- **@nestjs/swagger** v8.0.3 - Generación automática de OpenAPI

### Logging
- **Winston** v3.16.0 - Logger profesional con múltiples transportes

### Testing
- **Vitest** v2.1.5 - Framework de testing rápido
- **@vitest/coverage-istanbul** v2.1.5 - Cobertura de código
- **Supertest** v7.0.0 - Testing de endpoints HTTP

### Calidad de Código
- **ESLint** v9.15.0 - Linter de código
- **Prettier** v3.3.3 - Formateador de código
- **Husky** v9.1.7 - Git hooks
- **lint-staged** v15.2.10 - Linting en archivos staged
- **Commitlint** v19.6.0 - Validación de commits

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 22.x
- **npm** >= 10.x
- **Docker** y **Docker Compose** (opcional, para desarrollo con contenedores)
- **PostgreSQL** 14+ (si no usas Docker)
- **Git** (para control de versiones)

### Verificar Instalaciones

```bash
node --version    # Debe ser >= 22.x
npm --version     # Debe ser >= 10.x
docker --version  # Opcional
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd nest-started-boilerplate
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de plantilla y configura tus variables:

```bash
cp .env.template .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# APP
PORT=3002
HOST=localhost
NODE_ENV=development

# DB
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nest_boilerplate
DB_USERNAME=admin
DB_PASSWORD=my-weak-password

# PGADMIN
PGADMIN_DEFAULT_EMAIL=admin@nestjs.com
PGADMIN_DEFAULT_PASSWORD=my-weak-password
PGADMIN_LISTEN_PORT=80

# CORS
CORS_ORIGIN=http://localhost:*

# THROTTLER (Rate Limiting)
THROTTLER_TTL=60000    # 60 segundos
THROTTLER_LIMIT=10     # 10 requests por ventana
```

### 4. Iniciar Base de Datos (con Docker)

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto `5432`
- pgAdmin en el puerto `8080`

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo con hot-reload
npm run dev

# Modo desarrollo estándar
npm start

# Modo producción
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3002`

---

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza `@nestjs/config` para gestionar variables de entorno de forma global y cacheada.

#### Archivos de Configuración

- `.env` - Configuración local (no versionado)
- `.env.template` - Plantilla de configuración
- `.env.test` - Configuración para testing

#### Variables Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3002` |
| `HOST` | Host del servidor | `localhost` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `nest_boilerplate` |
| `DB_USERNAME` | Usuario de la base de datos | `admin` |
| `DB_PASSWORD` | Contraseña de la base de datos | `my-weak-password` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | `http://localhost:*` |
| `THROTTLE_TTL` | Ventana de tiempo corto plazo (ms) | `60000` |
| `THROTTLE_LIMIT` | Límite de requests corto plazo | `10` |
| `THROTTLE_LONG_TTL` | Ventana de tiempo largo plazo (ms) | `3600000` |
| `THROTTLE_LONG_LIMIT` | Límite de requests largo plazo | `100` |

### Configuración de Base de Datos

La configuración de TypeORM es dinámica y se adapta según el entorno:

**Desarrollo:**
- `synchronize: true` - Sincronización automática de esquemas
- `logging: 'all'` - Logs detallados de queries
- Genera archivo `ormconfig.json` automáticamente

**Producción:**
- `synchronize: false` - Requiere migraciones manuales
- `logging: false` - Sin logs de queries
- Mayor seguridad y control

---

## 📁 Estructura del Proyecto

```
nest-started-boilerplate/
├── .husky/                      # Git hooks configurados
├── db/                          # Volúmenes de Docker para PostgreSQL
├── dist/                        # Código compilado
├── logs/                        # Archivos de log (producción)
├── node_modules/                # Dependencias
├── src/                         # Código fuente
│   ├── common/                  # Recursos compartidos
│   │   └── enum/               # Enumeraciones
│   │       ├── enviroment.enum.ts
│   │       └── index.ts
│   ├── config/                  # Configuraciones
│   │   ├── configuration.env.ts
│   │   ├── database.config.env.ts
│   │   └── index.ts
│   ├── database/                # Módulo de base de datos
│   │   ├── database.module.ts
│   │   └── database.provider.ts
│   ├── modules/                 # Módulos de negocio
│   │   ├── users/              # Módulo de usuarios (ejemplo)
│   │   │   ├── dto/
│   │   │   │   └── create-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── interfaces/
│   │   │   │   └── user.interface.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   └── index.ts
│   ├── shared/                  # Servicios compartidos
│   │   └── services/
│   │       ├── api.config.service.ts
│   │       └── logger.service.ts
│   ├── app.controller.ts        # Controlador raíz
│   ├── app.module.ts            # Módulo raíz
│   ├── app.service.ts           # Servicio raíz
│   ├── main.ts                  # Punto de entrada
│   ├── main.middleware.ts       # Configuración de middlewares
│   └── setup-swagger.ts         # Configuración de Swagger
├── test/                        # Tests
│   ├── modules/
│   │   └── users/
│   ├── app.controller.spec.ts
│   ├── app.e2e-spec.ts
│   └── main.ts
├── .dockerignore
├── .env                         # Variables de entorno (no versionado)
├── .env.template                # Plantilla de variables
├── .env.test                    # Variables para testing
├── .gitignore
├── .prettierrc                  # Configuración de Prettier
├── commitlint.config.ts         # Configuración de Commitlint
├── create-vitest-config-test.ts # Configuración de Vitest
├── docker-compose.yml           # Orquestación de contenedores
├── Dockerfile                   # Imagen de Docker
├── eslint.config.mjs            # Configuración de ESLint
├── nest-cli.json                # Configuración de NestJS CLI
├── ormconfig.json               # Configuración de TypeORM (generado)
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de TypeScript
├── tsconfig.build.json          # Configuración de build
├── vitest.config.unit.ts        # Configuración de tests unitarios
├── vitest.config.e2e.ts         # Configuración de tests E2E
└── README.md                    # Documentación básica
```

### Descripción de Carpetas Clave

#### `src/common/`
Recursos compartidos entre módulos (enums, constantes, utilidades).

#### `src/config/`
Archivos de configuración centralizados.

#### `src/database/`
Configuración y provider de TypeORM.

#### `src/modules/`
Módulos de negocio. Cada módulo sigue la estructura:
- `dto/` - Data Transfer Objects para validación
- `entities/` - Entidades de TypeORM
- `interfaces/` - Interfaces de TypeScript
- `*.controller.ts` - Controladores HTTP
- `*.service.ts` - Lógica de negocio
- `*.module.ts` - Definición del módulo

#### `src/shared/`
Servicios compartidos (logger, configuración API, etc.).

---

## ✨ Características Implementadas

### 1. Seguridad

#### Helmet
Protección de headers HTTP contra vulnerabilidades comunes:
```typescript
app.use(helmet());
```

#### CORS
Control de acceso entre orígenes configurado dinámicamente:
```typescript
app.enableCors({
  origin: configService.get<string>('CORS_ORIGIN')
});
```

#### Rate Limiting
Protección contra ataques de fuerza bruta y DDoS con configuración dual (corto y largo plazo):
```typescript
ThrottlerModule.forRootAsync({
  useFactory: (config: ConfigService) => [
    {
      name: 'short',
      ttl: Number(config.get('THROTTLE_TTL', 60000)),
      limit: Number(config.get('THROTTLE_LIMIT', 10))
    },
    {
      name: 'long',
      ttl: Number(config.get('THROTTLE_LONG_TTL', 3600000)),
      limit: Number(config.get('THROTTLE_LONG_LIMIT', 100))
    }
  ]
})
```

Ver la [sección completa de Rate Limiting](#-rate-limiting) para más detalles.

#### Validación de Datos
Validación automática de DTOs con `class-validator`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  })
);
```

### 2. Logging con Winston

Sistema de logging profesional con diferentes niveles según el entorno:

**Desarrollo:**
- Logs en consola
- Nivel: `debug`
- Formato con colores y timestamps

**Testing:**
- Logs en consola
- Nivel: `warn`
- Solo advertencias y errores

**Producción:**
- Logs en archivos
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los logs
- Nivel: `info`

**Uso:**
```typescript
logger.log('Mensaje informativo');
logger.error('Error crítico', stackTrace);
logger.warn('Advertencia');
logger.debug('Información de debug');
```

### 3. Documentación API con Swagger

Documentación automática de la API disponible en desarrollo:

**URL:** `http://localhost:3002/docs`  
**JSON:** `http://localhost:3002/docs/json`

Características:
- Generación automática desde decoradores
- Soporte para Bearer Authentication
- Especificación REST nivel 3 (Richardson)
- Descarga de especificación OpenAPI

**Ejemplo de uso:**
```typescript
@ApiProperty({ description: 'Email del usuario' })
@IsString()
readonly email: string;
```

### 4. Versionamiento de API

API versionada por URI con versión por defecto:

```
http://localhost:3002/api/v1/users
```

Configuración:
```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1'
});
```

### 5. Compresión HTTP

Compresión automática de respuestas para mejorar el rendimiento:
```typescript
app.use(compression());
```

### 6. Serialización y Transformación

**Serialización (Class → JSON):**
```typescript
app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector))
);
```

**Deserialización (JSON → Class):**
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  })
);
```

### 7. Manejo de Errores

Captura global de errores no controlados:
```typescript
process.on('uncaughtException', error => handleError(error, logger));
process.on('unhandledRejection', error => handleError(error, logger));
```
Manejan errores como:

Excepciones de JavaScript sin try/catch

Promesas que fallan sin catch

Errores al arrancar Nest

Bugs inesperados

Errores de librerías externas que no usa Nest

📌 Su propósito es evitar que la aplicación muera sin un log
(perfecto para producción).
---

## 💻 Uso y Desarrollo

### Crear un Nuevo Módulo

```bash
# Generar módulo completo
nest g module modules/products
nest g controller modules/products
nest g service modules/products

# Generar DTO
nest g class modules/products/dto/create-product.dto --no-spec

# Generar Entity
nest g class modules/products/entities/product.entity --no-spec
```

### Estructura de un Módulo

```typescript
// product.entity.ts
@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}

// create-product.dto.ts
export class CreateProductDto {
  @IsString()
  @ApiProperty({ description: 'Nombre del producto' })
  readonly name: string;

  @IsNumber()
  @ApiProperty({ description: 'Precio del producto' })
  readonly price: number;
}

// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }
}

// products.controller.ts
@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

### Endpoints Disponibles

#### Health Check
```
GET http://localhost:3002/api/
Response: "Hello World!"
```

#### Users (Ejemplo)
```
POST   http://localhost:3002/api/v1/users
GET    http://localhost:3002/api/v1/users/getall
GET    http://localhost:3002/api/v1/users/:id
DELETE http://localhost:3002/api/v1/users/:id
```

---

## 🧪 Testing

### Configuración de Testing

El proyecto utiliza **Vitest** con configuraciones separadas para tests unitarios y E2E.

#### Tests Unitarios
- **Ubicación:** `tests/unit/**/*.test.ts`
- **Cobertura:** `coverage/unit/`
- **Configuración:** `vitest.config.unit.ts`

#### Tests E2E
- **Ubicación:** `tests/e2e/**/*.test.ts`
- **Cobertura:** `coverage/e2e/`
- **Configuración:** `vitest.config.e2e.ts`

### Ejecutar Tests

```bash
# Todos los tests (unit + e2e)
npm test

# Solo tests unitarios
npm run test:unit

# Solo tests E2E
npm run test:e2e

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:cov
```

### Escribir Tests

**Test Unitario:**
```typescript
import { describe, it, expect } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  it('should create a user', () => {
    const service = new UsersService();
    const result = service.create({ name: 'John' });
    expect(result).toBeDefined();
  });
});
```

**Test E2E:**
```typescript
import { describe, it, expect } from 'vitest';
import * as request from 'supertest';

describe('Users (e2e)', () => {
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John' })
      .expect(201);
  });
});
```

---

## 🐳 Docker

### Servicios Disponibles

El archivo `docker-compose.yml` define dos servicios:

#### 1. PostgreSQL
- **Imagen:** `postgres:14.15-alpine3.20`
- **Puerto:** `5432`
- **Volumen:** `./db/postgres`
- **Credenciales:** Definidas en `.env`

#### 2. pgAdmin
- **Imagen:** `dpage/pgadmin4`
- **Puerto:** `8080`
- **URL:** `http://localhost:8080`
- **Credenciales:** Definidas en `.env`

### Comandos Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose up -d --build
```

### Dockerfile

El proyecto incluye un `Dockerfile` para containerizar la aplicación:

```bash
# Construir imagen
docker build -t nest-boilerplate .

# Ejecutar contenedor
docker run -p 3002:3002 nest-boilerplate
```

---

## 🛡️ Rate Limiting

### Descripción General

El sistema de rate limiting protege la API contra ataques de denegación de servicio (DoS), uso abusivo de recursos y fuerza bruta. Utiliza el módulo `@nestjs/throttler` con configuración dual para límites de corto y largo plazo.

### Configuración

#### Variables de Entorno

El rate limiting se configura mediante variables de entorno con valores por defecto seguros:

```env
# Rate Limiting - Corto Plazo (por minuto)
THROTTLE_TTL=60000          # 60 segundos (1 minuto)
THROTTLE_LIMIT=10           # 10 peticiones por minuto

# Rate Limiting - Largo Plazo (por hora)
THROTTLE_LONG_TTL=3600000   # 3600 segundos (1 hora)
THROTTLE_LONG_LIMIT=100     # 100 peticiones por hora
```

**Parámetros:**
- `TTL (Time To Live)`: Ventana de tiempo en milisegundos durante la cual se cuentan las peticiones
- `LIMIT`: Número máximo de peticiones permitidas dentro de la ventana TTL

#### Configuración por Entorno

**Desarrollo:**
```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_LONG_TTL=3600000
THROTTLE_LONG_LIMIT=1000
```
Límites más permisivos para facilitar el desarrollo y testing.

**Producción:**
```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
THROTTLE_LONG_TTL=3600000
THROTTLE_LONG_LIMIT=100
```
Límites restrictivos para proteger la API en producción.

**Testing:**
```env
THROTTLE_TTL=1000
THROTTLE_LIMIT=5
THROTTLE_LONG_TTL=10000
THROTTLE_LONG_LIMIT=20
```
Límites bajos y ventanas cortas para tests rápidos.

### Funcionamiento

#### Límites Globales

Por defecto, todos los endpoints están protegidos con los límites configurados:

```typescript
// Configuración en AppModule
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      name: 'short',
      ttl: Number(config.get('THROTTLE_TTL', 60000)),
      limit: Number(config.get('THROTTLE_LIMIT', 10))
    },
    {
      name: 'long',
      ttl: Number(config.get('THROTTLE_LONG_TTL', 3600000)),
      limit: Number(config.get('THROTTLE_LONG_LIMIT', 100))
    }
  ]
})
```

El guard se aplica globalmente a través de `APP_GUARD`:

```typescript
{
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
```

### Uso de Decoradores

#### @SkipThrottle - Excluir Endpoints

Usa `@SkipThrottle()` para excluir endpoints específicos del rate limiting:

**Excluir un controlador completo:**
```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

**Excluir un endpoint específico:**
```typescript
@Controller('users')
export class UsersController {
  @SkipThrottle()
  @Get('public')
  getPublicData() {
    // Este endpoint NO tiene rate limiting
    return { data: 'public' };
  }
  
  @Get('private')
  getPrivateData() {
    // Este endpoint SÍ tiene rate limiting
    return { data: 'private' };
  }
}
```

**Excluir solo de una configuración específica:**
```typescript
@Controller('api')
export class ApiController {
  @SkipThrottle({ short: true })
  @Get('data')
  getData() {
    // Solo aplica el límite 'long', no el 'short'
    return { data: 'example' };
  }
}
```

#### @Throttle - Límites Personalizados

Usa `@Throttle()` para configurar límites personalizados por endpoint:

**Límite más restrictivo para operaciones costosas:**
```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('reports')
export class ReportsController {
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  @Post('generate')
  generateReport() {
    // Solo 3 peticiones por minuto
    return { message: 'Report generation started' };
  }
}
```

**Múltiples límites (corto y largo plazo):**
```typescript
@Controller('uploads')
export class UploadsController {
  @Throttle({ 
    short: { ttl: 60000, limit: 5 },
    long: { ttl: 3600000, limit: 50 }
  })
  @Post('file')
  uploadFile() {
    // 5 peticiones por minuto Y 50 por hora
    return { message: 'File uploaded' };
  }
}
```

**Límite más permisivo para endpoints públicos:**
```typescript
@Controller('public')
export class PublicController {
  @Throttle({ short: { ttl: 60000, limit: 50 } })
  @Get('content')
  getContent() {
    // 50 peticiones por minuto
    return { content: 'public data' };
  }
}
```

### Respuestas y Headers

#### Respuesta Exitosa

Cuando una petición está dentro del límite, se incluyen headers informativos:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1700000000
Content-Type: application/json

{
  "data": "response"
}
```

**Headers:**
- `X-RateLimit-Limit`: Límite máximo de peticiones configurado
- `X-RateLimit-Remaining`: Número de peticiones restantes en la ventana actual
- `X-RateLimit-Reset`: Timestamp Unix cuando se resetea el contador

#### Error 429 - Too Many Requests

Cuando se excede el límite, la API retorna un error 429:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700000060
Retry-After: 60
Content-Type: application/json

{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Headers adicionales:**
- `Retry-After`: Segundos que debe esperar el cliente antes de reintentar

#### Ejemplo de Flujo

```bash
# Primera petición
curl -i http://localhost:3002/api/v1/users
# X-RateLimit-Remaining: 9

# Segunda petición
curl -i http://localhost:3002/api/v1/users
# X-RateLimit-Remaining: 8

# ... (8 peticiones más)

# Petición 11 (excede el límite)
curl -i http://localhost:3002/api/v1/users
# HTTP/1.1 429 Too Many Requests
# Retry-After: 45
```

### Casos de Uso Comunes

#### 1. Health Check sin Límite

```typescript
@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: Date.now() };
  }
}
```

#### 2. Autenticación con Límite Restrictivo

```typescript
@Controller('auth')
export class AuthController {
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post('login')
  login(@Body() credentials: LoginDto) {
    // Solo 5 intentos de login por minuto
    return this.authService.login(credentials);
  }
}
```

#### 3. API Pública con Límite Moderado

```typescript
@Controller('public')
export class PublicController {
  @Throttle({ 
    short: { ttl: 60000, limit: 30 },
    long: { ttl: 3600000, limit: 500 }
  })
  @Get('articles')
  getArticles() {
    // 30 por minuto, 500 por hora
    return this.articlesService.findAll();
  }
}
```

#### 4. Operaciones Administrativas sin Límite

```typescript
@Controller('admin')
export class AdminController {
  @SkipThrottle()
  @UseGuards(AdminGuard)
  @Get('stats')
  getStats() {
    // Sin límite para administradores autenticados
    return this.statsService.getAll();
  }
}
```

### Consideraciones Importantes

#### Identificación de Clientes

Por defecto, el rate limiting se basa en la **dirección IP del cliente**. Esto significa:
- Clientes detrás del mismo NAT/proxy comparten el límite
- En desarrollo local, todas las peticiones usan la misma IP

#### Storage

**Desarrollo/Testing:**
- Usa almacenamiento en memoria (por defecto)
- Los límites se resetean al reiniciar la aplicación

**Producción (múltiples instancias):**
- Considera usar Redis como storage compartido:
```typescript
ThrottlerModule.forRoot({
  storage: new ThrottlerStorageRedisService(redisClient),
  throttlers: [...]
})
```

#### Performance

- Overhead mínimo: ~1-2ms por petición
- No afecta significativamente el rendimiento de la API

#### Logging

Los intentos de exceder límites no se registran por defecto. Para monitoreo:

```typescript
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    
    // Log del intento
    logger.warn(`Rate limit exceeded: ${request.ip} - ${request.url}`);
    
    // Respuesta estándar
    ctx.getResponse().status(429).json({
      statusCode: 429,
      message: 'Too Many Requests'
    });
  }
}
```

### Testing

Para testear el rate limiting en tests E2E:

```typescript
describe('Rate Limiting (e2e)', () => {
  it('should return 429 when limit is exceeded', async () => {
    const limit = 10;
    
    // Hacer 10 peticiones exitosas
    for (let i = 0; i < limit; i++) {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200);
    }
    
    // La petición 11 debe fallar
    const response = await request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(429);
    
    expect(response.body.statusCode).toBe(429);
    expect(response.headers['x-ratelimit-remaining']).toBe('0');
  });
});
```

### Troubleshooting

**Problema:** Los límites no se aplican
- Verifica que `ThrottlerGuard` esté configurado como `APP_GUARD`
- Revisa que las variables de entorno estén correctamente definidas

**Problema:** Error 429 en desarrollo
- Aumenta los límites en `.env` para desarrollo
- Considera usar `@SkipThrottle()` en endpoints de testing

**Problema:** Límites compartidos entre usuarios
- Implementa un custom key generator basado en usuario autenticado:
```typescript
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.user?.id || req.ip;
  }
}
```

---

## 📝 Buenas Prácticas

### Commits Convencionales

El proyecto utiliza **Conventional Commits** con validación automática:

```bash
feat: agregar módulo de productos
fix: corregir validación de email
docs: actualizar README
style: formatear código con prettier
refactor: reorganizar estructura de carpetas
test: agregar tests para users service
chore: actualizar dependencias
```

**Tipos permitidos:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bugs
- `docs` - Documentación
- `style` - Formato de código
- `refactor` - Refactorización
- `test` - Tests
- `chore` - Tareas de mantenimiento
- `perf` - Mejoras de rendimiento
- `ci` - Integración continua

### Formateo de Código

```bash
# Formatear código
npm run format

# Verificar linting
npm run lint
```

### Git Hooks

**Pre-commit:**
- Formatea archivos staged automáticamente
- Ejecuta linting

**Commit-msg:**
- Valida formato de commits

**Pre-push:**
- Ejecuta tests antes de push

### Desactivar Husky

Si necesitas desactivar temporalmente los hooks:

```bash
# Desactivar
npm run husky:disable

# Reactivar
npm run husky:enable
```

---

## 📜 Scripts Disponibles

```json
{
  "build": "Compila el proyecto TypeScript",
  "dev": "Inicia en modo desarrollo con debug",
  "start": "Inicia con hot-reload",
  "start:debug": "Inicia con debugger",
  "start:prod": "Inicia en modo producción",
  "lint": "Ejecuta ESLint con auto-fix",
  "format": "Formatea código con Prettier",
  "test": "Ejecuta todos los tests",
  "test:unit": "Ejecuta tests unitarios",
  "test:e2e": "Ejecuta tests E2E",
  "test:watch": "Tests en modo watch",
  "test:cov": "Tests con cobertura",
  "prepare": "Instala Husky hooks"
}
```

---

## 🗺️ Roadmap

### ✅ Implementado

- [x] Versionamiento de API
- [x] Compresión HTTP
- [x] CORS configurado
- [x] Helmet para seguridad
- [x] Swagger/OpenAPI
- [x] Middlewares modulares
- [x] Logger con Winston
- [x] Validation Pipes
- [x] Serialización con class-transformer
- [x] Vitest configurado
- [x] Husky + Conventional Commits
- [x] Prettier + ESLint
- [x] Rate Limiting

### 🚧 Pendiente

- [ ] Keep-alive
- [ ] Public path
- [ ] Migraciones de TypeORM
- [ ] Seeders de base de datos
- [ ] Decoradores custom
- [ ] Manejo global de errores
- [ ] Implementación completa de endpoints
- [ ] Sistema de autorización (roles y permisos)
- [ ] Autenticación JWT
- [ ] OAuth 2.0
- [ ] Cache con @nestjs/cache-manager
- [ ] CI/CD pipeline
- [ ] Middleware de errores (HOF)
- [ ] HATEOAS
- [ ] Migración a ES Modules
- [ ] Módulo de salud (health checks)
- [ ] Archivos .nvmrc y .npmrc
- [ ] Migración a SWC
- [ ] Configuración de debugger avanzada
- [ ] Tests de performance con K6

---

## 📞 Soporte y Contacto

- **Autor:** DevJohanAdrian
- **Repositorio:** [GitHub](https://github.com/AlbertHernandez/nestjs-service-template)
- **Issues:** [Reportar un problema](https://github.com/AlbertHernandez/nestjs-service-template/issues)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

Este boilerplate está basado en las mejores prácticas de la comunidad de NestJS y en el trabajo de desarrolladores que comparten su conocimiento.

---

**Última actualización:** Noviembre 2024  
**Versión de la documentación:** 1.0.0
