import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { UserGameHistoryQueryInputDto } from '../../dto/user-game-history-query-input.dto';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';

export class GetUserGameHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly queryDto: UserGameHistoryQueryInputDto,
  ) {}
}

@QueryHandler(GetUserGameHistoryQuery)
export class GetUserGameHistoryQueryHandler implements ICommandHandler<GetUserGameHistoryQuery> {
  constructor(
    private readonly pairGameQueryRepository: PairGamesQueryRepository,
  ) {}

  async execute({ userId, queryDto }: GetUserGameHistoryQuery) {
    return this.pairGameQueryRepository.getUserGameHistory(userId, queryDto);
  }
}
