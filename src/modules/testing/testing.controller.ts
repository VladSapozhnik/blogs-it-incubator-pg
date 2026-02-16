import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<void> {
    // Получаем все таблицы в схеме public
    // const tables: { table_name: string }[] = await this.dataSource.query(
    //   `SELECT table_name FROM information_schema.tables
    //          WHERE table_schema='public' AND table_type='BASE TABLE';`,
    // );
    //
    // // Чистим все таблицы параллельно
    // if (tables.length > 0) {
    //   for (const table of tables) {
    //     await this.dataSource.query(
    //       `DELETE FROM "${table.table_name}" CASCADE;`,
    //     );
    //   }
    // }
    const tables: { table_name: string }[] = await this.dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `);

    for (const { table_name } of tables) {
      await this.dataSource.query(`DELETE FROM "${table_name}";`);
    }
  }
}
