import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProfileMapper } from '../../mappers/profile.mapper';
import { UsersQueryExternalRepository } from '../../../users/repositories/users.query.external.repository';

export class GetProfileQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    private readonly usersQueryExternalRepository: UsersQueryExternalRepository,
  ) {}

  async execute({ id }: GetProfileQuery): Promise<ProfileMapper> {
    return this.usersQueryExternalRepository.getProfile(id);
  }
}
