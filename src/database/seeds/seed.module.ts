import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role } from '@modules/users/entities';
import { RefreshToken } from '@modules/auth/entities';
import { SeedService } from './seed.service';
import { DatabaseProvider } from '../database.provider';


// Este módulo será ejecutado manualmente fuera del AppModule.
// TypeOrmModule.forFeature(...): carga las entidades necesarias para ejecutar queries.
// el seeder usa la misma configuración de TypeORM que tu aplicación, porque NestJS la carga automáticamente cuando usas: TypeOrmModule.forRootAsync(...)
@Module({
  imports: [
      // 👇 Necesario para que ConfigService funcione en el seeder
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 👇 Conexión EXACTA de tu proyecto
    DatabaseProvider,

    // 👇 Repositorios necesarios para insertar datos
    TypeOrmModule.forFeature([User, Role, RefreshToken]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
