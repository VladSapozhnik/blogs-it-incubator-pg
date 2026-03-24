import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';

export class GetMyCurrentPairGameQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyCurrentPairGameQuery)
export class GetMyCurrentPairGameQueryHandler implements IQueryHandler<GetMyCurrentPairGameQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
  ) {}

  async execute({ userId }: GetMyCurrentPairGameQuery): Promise<PairGame> {
    return this.pairGamesQueryRepository.getMyGame(userId);
  }
}
