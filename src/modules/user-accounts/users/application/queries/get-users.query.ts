import { UsersQueryRepository } from '../../repositories/users.query.repository';
import { GetUsersQueryParamsDto } from '../../dto/users-query-input.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { UsersMapper } from '../../mappers/users.mapper';

export class GetUsersQuery {
  constructor(public readonly query: GetUsersQueryParamsDto) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute({
    query,
  }: GetUsersQuery): Promise<PaginatedViewDto<UsersMapper[]>> {
    return this.usersQueryRepository.getAllUsers(query);
  }
}
