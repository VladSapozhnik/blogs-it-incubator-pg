import { GetUsersQueryParamsDto } from '../dto/users-query-input.dto';
import { UsersMapper } from '../mappers/users.mapper';
import { HttpStatus } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

type UserAndTotalCount = User & { total_count: string };

export class UsersQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getAllUsers(queryDto: GetUsersQueryParamsDto) {
    const users: UserAndTotalCount[] = await this.dataSource.query(
      `SELECT *, count(*) OVER() as total_count FROM users ORDER BY "${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $1 OFFSET $2;`,
      [queryDto.pageSize, queryDto.calculateSkip()],
    );

    const totalCount: number = Number(users[0]?.total_count) || 0;

    const items: UsersMapper[] = users.map(UsersMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getUserById(id: string) {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'User not found',
            field: 'id',
          },
        ],
      });
    }
    return UsersMapper.mapToView(user);
  }
}
