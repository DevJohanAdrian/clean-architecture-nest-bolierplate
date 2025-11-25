
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '@modules/auth/strategies/jwt-strategy';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    // jwt se importa desde @nestjs/jwt para poder usar jwtservice en authservice y crear jwt, no se importa en app modulo porque solo se necesita aqui.
    // se pasa secret y signOptions para que queden por default en caso de usar jwtService en otro lugar y no pasar estos parametros.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRATION', '15m');
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expiresIn: expiresIn as any
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
