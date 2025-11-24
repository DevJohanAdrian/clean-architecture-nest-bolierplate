# Requirements Document

## Introduction

Este documento define los requisitos para la configuración de rate limiting en el boilerplate de NestJS. El rate limiting es un mecanismo de seguridad que limita el número de peticiones que un cliente puede realizar a la API en un período de tiempo determinado, protegiendo la aplicación contra ataques de denegación de servicio (DoS) y uso abusivo de recursos.

## Glossary

- **Rate Limiter**: Sistema que controla la tasa de peticiones permitidas desde un cliente hacia la API
- **ThrottlerModule**: Módulo de NestJS que proporciona funcionalidad de rate limiting
- **ThrottlerGuard**: Guard de NestJS que aplica las reglas de rate limiting a los endpoints
- **TTL (Time To Live)**: Ventana de tiempo en milisegundos durante la cual se cuentan las peticiones
- **Limit**: Número máximo de peticiones permitidas dentro de la ventana TTL
- **Skip Endpoint**: Endpoint que está excluido de las reglas de rate limiting
- **Custom Rate Limit**: Configuración de rate limiting específica para un endpoint o controlador particular

## Requirements

### Requirement 1

**User Story:** Como desarrollador de API, quiero tener rate limiting configurado globalmente, para que mi aplicación esté protegida contra ataques de denegación de servicio por defecto

#### Acceptance Criteria

1. WHEN THE Rate Limiter se inicializa, THE ThrottlerModule SHALL cargar la configuración desde variables de entorno
2. THE ThrottlerModule SHALL aplicar límites globales definidos por THROTTLE_TTL y THROTTLE_LIMIT
3. WHEN un cliente excede el límite de peticiones, THE Rate Limiter SHALL retornar un error HTTP 429 (Too Many Requests)
4. THE Rate Limiter SHALL incluir headers informativos en la respuesta (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

### Requirement 2

**User Story:** Como desarrollador de API, quiero poder excluir endpoints específicos del rate limiting, para que endpoints públicos o de health check no sean limitados

#### Acceptance Criteria

1. THE ThrottlerGuard SHALL proporcionar un decorador @SkipThrottle para excluir endpoints
2. WHEN un endpoint está decorado con @SkipThrottle, THE Rate Limiter SHALL omitir la validación de límites para ese endpoint
3. THE Rate Limiter SHALL permitir excluir controladores completos del rate limiting
4. THE Rate Limiter SHALL documentar claramente qué endpoints están excluidos

### Requirement 3

**User Story:** Como desarrollador de API, quiero poder configurar límites personalizados para endpoints específicos, para que endpoints críticos o costosos tengan límites más restrictivos

#### Acceptance Criteria

1. THE ThrottlerGuard SHALL proporcionar un decorador @Throttle para configurar límites personalizados
2. WHEN un endpoint está decorado con @Throttle, THE Rate Limiter SHALL aplicar los límites especificados en lugar de los globales
3. THE Rate Limiter SHALL permitir configurar múltiples límites (corto y largo plazo) para un mismo endpoint
4. THE Rate Limiter SHALL validar que los límites personalizados sean valores numéricos positivos

### Requirement 4

**User Story:** Como administrador del sistema, quiero poder ajustar los límites de rate limiting mediante variables de entorno, para que pueda adaptar la configuración según el entorno (desarrollo, producción)

#### Acceptance Criteria

1. THE Rate Limiter SHALL leer THROTTLE_TTL desde variables de entorno con un valor por defecto de 60000 milisegundos
2. THE Rate Limiter SHALL leer THROTTLE_LIMIT desde variables de entorno con un valor por defecto de 10 peticiones
3. WHEN las variables de entorno no están definidas, THE Rate Limiter SHALL utilizar valores por defecto seguros
4. THE Rate Limiter SHALL validar que los valores de configuración sean numéricos y positivos

### Requirement 5

**User Story:** Como desarrollador de API, quiero tener documentación clara sobre la configuración de rate limiting, para que otros desarrolladores puedan entender y modificar la configuración fácilmente

#### Acceptance Criteria

1. THE Rate Limiter SHALL incluir comentarios en el código explicando la configuración
2. THE Rate Limiter SHALL documentar ejemplos de uso de @SkipThrottle y @Throttle en el README
3. THE Rate Limiter SHALL incluir ejemplos de configuración para diferentes escenarios (desarrollo, producción)
4. THE Rate Limiter SHALL documentar las respuestas de error y headers relacionados con rate limiting
