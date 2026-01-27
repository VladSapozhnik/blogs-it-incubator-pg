import { UsersQueryRepository } from '../../repositories/users.query.repository';
import { UsersMapper } from '../../mappers/users.mapper';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute({ id }: GetUserByIdQuery): Promise<UsersMapper> {
    return this.usersQueryRepository.getUserById(id);
  }
}
