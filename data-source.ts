import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'aulavirtual',
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: [
    'src/database/migrations/*.ts',
    'dist/database/migrations/*.js',
  ],
  synchronize: false,
});
