import { GetUsersQueryParamsDto } from '../dto/users-query-input.dto';
import { UsersMapper } from '../mappers/users.mapper';
import { HttpStatus } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getAllUsers(
    queryDto: GetUsersQueryParamsDto,
  ): Promise<PaginatedViewDto<UsersMapper[]>> {
    const where = queryDto.buildUserFilter();

    const [users, totalCount] = await this.userRepository.findAndCount({
      where,
      order: {
        [queryDto.sortBy]: queryDto.sortDirection,
      },
      take: queryDto.pageSize,
      skip: queryDto.calculateSkip(),
    });

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
