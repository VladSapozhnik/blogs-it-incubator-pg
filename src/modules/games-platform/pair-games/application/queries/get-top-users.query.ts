import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TopUsersQueryInputDto } from '../../dto/top-users-query-input.dto';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';

export class GetTopUsersQuery {
  constructor(public readonly queryDto: TopUsersQueryInputDto) {}
}

@QueryHandler(GetTopUsersQuery)
export class GetTopUsersQueryHandler implements IQueryHandler<GetTopUsersQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
  ) {}

  async execute({ queryDto }: GetTopUsersQuery) {
    return this.pairGamesQueryRepository.getTopUsers(queryDto);
  }
}
