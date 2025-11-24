// import { config, dbConfig } from './config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { UsersModule, AuthModule } from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    // Envs
    ConfigModule.forRoot({
      // load: [config],
      isGlobal: true,
      cache: true //Cache environment variables
    }),
    //DB TypeORM
    DatabaseModule,
    // Rate limit - Multiple throttlers for short-term and long-term protection
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: Number(config.get('THROTTLE_TTL', 60000)), // 1 minute default
          limit: Number(config.get('THROTTLE_LIMIT', 10)) // 10 requests per minute default
        },
        {
          name: 'long',
          ttl: Number(config.get('THROTTLE_LONG_TTL', 3600000)), // 1 hour default
          limit: Number(config.get('THROTTLE_LONG_LIMIT', 100)) // 100 requests per hour default
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: []
})
export class AppModule {
  static port;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<string>('PORT');
  }
}
