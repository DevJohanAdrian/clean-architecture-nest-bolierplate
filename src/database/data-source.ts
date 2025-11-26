// Este archivo solo sera usado por el CLI de typeOrm para hacer migraciones
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config(); // cargar variables del .env


config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    join(__dirname, '../modules/**/*.entity.{ts,js}')
  ],

  migrations: [
    join(__dirname, './migrations/*.{ts,js}')
  ],

  synchronize: false,
  logging: true,
});

