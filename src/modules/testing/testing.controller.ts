import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SecurityDevice } from '../user-accounts/security-devices/entities/security-device.entity';
import { PasswordRecovery } from '../user-accounts/password-recovery/entities/password-recovery.entity';
import { User } from '../user-accounts/users/entities/user.entity';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(): Promise<void> {
    try {
      const entities = [
        SecurityDevice,
        PasswordRecovery,
        // CommentLike,
        // PostLike,
        // Comment,
        // Post,
        // Blog,
        User,
      ];

      for (const entity of entities) {
        await this.dataSource.getRepository(entity).clear();
      }
    } catch (e) {
      // Если здесь будет 500, в консоли бэкенда будет написано, какой таблицы не хватает
      console.error('ОШИБКА ОЧИСТКИ БАЗЫ:', e.message);
      throw e;
    }
  }
}
