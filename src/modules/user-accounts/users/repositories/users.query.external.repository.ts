import { HttpStatus, Injectable } from '@nestjs/common';
// import { ProfileMapper } from '../../auth/mappers/profile.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { User } from '../entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getProfile(id: string) {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }
    // return ProfileMapper.mapToView(user);
  }
}
