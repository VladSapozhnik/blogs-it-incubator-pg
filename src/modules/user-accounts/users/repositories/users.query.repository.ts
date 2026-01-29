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
    const filter = queryDto.buildUserFilter();

    const users: UserAndTotalCount[] = await this.dataSource.query(
      `
        SELECT *, count(*) OVER() AS total_count
        FROM users
        WHERE
          ($1::text IS NULL OR login ILIKE '%' || $1 || '%')
          OR ($2::text IS NULL OR email ILIKE '%' || $2 || '%')
        ORDER BY "${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()}
    LIMIT $3
        OFFSET $4;
      `,
      [
        queryDto.searchLoginTerm,
        queryDto.searchEmailTerm,
        queryDto.pageSize,
        queryDto.calculateSkip(),
      ],
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
      `SELECT * FROM users WHERE id = $1 `,
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
