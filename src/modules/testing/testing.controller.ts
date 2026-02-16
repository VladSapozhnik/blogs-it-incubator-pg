import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<void> {
    try {
      // Получаем список всех таблиц, если их много,
      // либо перечисляем вручную:
      const entities = this.dataSource.entityMetadatas;
      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(', ');

      // Выполняем очистку
      if (tableNames.length > 0) {
        await this.dataSource.query(
          `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
        );
      }
    } catch (e) {
      console.error('Ошибка при очистке БД:', e);
      throw e; // Это пробросит ошибку выше и поможет увидеть её в логах
    }
  }
}
