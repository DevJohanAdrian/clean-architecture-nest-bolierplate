import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { middlewaresConfiguration } from './main.middleware';
import { AppLoggerService } from './shared/services/logger.service';
import { ResponseInterceptor, RequestLoggingInterceptor } from './interceptors';
import {NestExpressApplication} from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Prefix
  app.setGlobalPrefix('/api');

  // Habilita el versionamiento
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1' // Define la versión predeterminada globalmente
  });

  // Middlewares
  middlewaresConfiguration(app);

  // Logger
  const logger = new AppLoggerService(configService);
  app.useLogger(logger);

  // Serializacion interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // interceptor de respuesta global (orden importa)
  app.useGlobalInterceptors( new RequestLoggingInterceptor(logger), new ResponseInterceptor());


  // Pipes para deserializacion (Json -> class DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Para dar el tipo de dato esperado por endpoint (Id:number y createDto:Dto)
      whitelist: true, // Borra campos que no se esperan en la request
      forbidNonWhitelisted: true, // Lanza un error si se encuentra una propiedad no definida
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  await app.listen(AppModule.port, () => {
    // console.log(
    //   Server (${configService.get<string>('NODE_ENV')}) running on port http://${configService.get<string>('HOST')}:${AppModule.port},
    // );
    logger.log(
      `Server (${configService.get<string>('NODE_ENV')}) running on port http://${configService.get<string>('HOST')}:${configService.get<string>('PORT')}`
    );
  });
}

// Crear una instancia del logger
const configService = new ConfigService();
const logger = new AppLoggerService(configService);

// Arrancar la aplicación con manejo de errores
bootstrap().catch(error => handleError(error, logger));

// Función de manejo de errores
function handleError(error: Error, logger: AppLoggerService) {
  logger.error(`Unhandled error during bootstrap: ${error instanceof Error ? error.message : error}`, error.stack);
  process.exit(1);
}

// Capturar errores no controlados en tiempo de ejecución
process.on('uncaughtException', error => handleError(error, logger));
process.on('unhandledRejection', error => handleError(error as Error, logger));
