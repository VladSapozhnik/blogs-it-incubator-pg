import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
import { DataSource } from 'typeorm';

export default new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  // schema: 'public',
  migrations: ['src/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
