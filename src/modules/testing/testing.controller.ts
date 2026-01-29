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
    const tables: TableRow[] = await this.dataSource.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';`,
    );

    // Чистим все таблицы параллельно
    await Promise.all(
      tables.map((t: { table_name: string }) =>
        this.dataSource.query(
          `TRUNCATE TABLE "public"."${t.table_name}" RESTART IDENTITY CASCADE;`,
        ),
      ),
    );

    return {
      status: 'succeeded',
    };
  }
}
