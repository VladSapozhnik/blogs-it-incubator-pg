import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
import { DataSource } from 'typeorm';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
export default new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
