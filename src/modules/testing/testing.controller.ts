import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

interface TableRow {
  table_name: string;
}

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    // Получаем все таблицы в схеме public
    const tables: { table_name: string }[] = await this.dataSource.query(
      `SELECT table_name FROM information_schema.tables
             WHERE table_schema='public' AND table_type='BASE TABLE';`,
    );

    // Чистим все таблицы параллельно
    if (tables.length > 0) {
      const tableNames = tables.map((t) => `"${t.table_name}"`).join(', ');

      await this.dataSource.query(
        `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
