import { GetUsersQueryParamsDto } from '../dto/users-query-input.dto';
import { UsersMapper } from '../mappers/users.mapper';
import { HttpStatus } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { WithTotalCountType } from '../../../../core/types/with-total-count.type';

export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async getAllUsers(queryDto: GetUsersQueryParamsDto) {
    // const filter = queryDto.buildUserFilter();

    const users: WithTotalCountType<User>[] = await this.dataSource.query(
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

  async getUserById(id: string): Promise<UsersMapper> {
    const user: User | null = await this.userRepository.findOneBy({ id });

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
