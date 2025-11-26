import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { writeFileSync } from 'fs';

import { Environment } from 'src/common/enum';

async function createOrmConfigFile(dbConfig: DataSourceOptions) {
  const path = join(__dirname, '../../');
  writeFileSync(path + 'ormconfig.json', JSON.stringify(dbConfig, null, 2));
}

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const isDevelopmentEnv = config.get<string>('NODE_ENV') !== Environment.Production;

    const dbConfig = {
      type: 'postgres',
      host: config.get<string>('DB_HOST'),
      port: +config.get<string>('DB_PORT'),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize: isDevelopmentEnv, // en produccion debe de ser false
      migrations: ['dist/database/migrations/*.js'],
      entities: ['dist/**/*.entity.js'],
      cli: {
        migrationsDir: 'src/database/migrations'
      },
      logging: 'all'
    } as DataSourceOptions;

    if (isDevelopmentEnv) {
      createOrmConfigFile(dbConfig);
    }

    return dbConfig;
  }
});
