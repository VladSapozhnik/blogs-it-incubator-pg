import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { PairGameMapper } from '../../mappers/pair-game.mapper';
import { PairGamesQueryService } from '../pair-games.query.service';

export class GetMyCurrentPairGameQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyCurrentPairGameQuery)
export class GetMyCurrentPairGameQueryHandler implements IQueryHandler<GetMyCurrentPairGameQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
    private readonly pairGameQueryService: PairGamesQueryService,
  ) {}

  async execute({
    userId,
  }: GetMyCurrentPairGameQuery): Promise<PairGameMapper> {
    const currentGame: PairGame =
      await this.pairGamesQueryRepository.getMyActiveOrPendingGame(userId);

    return this.pairGameQueryService.getPairGameViewData(currentGame);
  }
}
