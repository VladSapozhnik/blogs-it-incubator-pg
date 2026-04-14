import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { PairGameMapper } from '../../mappers/pair-game.mapper';
import { PairGamesQueryService } from '../pair-games.query.service';
import { GameStatusEnum } from '../../enums/game-status.enum';
import { PairGamesService } from '../pair-games.service';

export class GetMyCurrentPairGameQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyCurrentPairGameQuery)
export class GetMyCurrentPairGameQueryHandler implements IQueryHandler<GetMyCurrentPairGameQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
    private readonly pairGameQueryService: PairGamesQueryService,
    private readonly pairGamesService: PairGamesService,
  ) {}

  // async execute({
  //   userId,
  // }: GetMyCurrentPairGameQuery): Promise<PairGameMapper> {
  //   const currentGame: PairGame =
  //     await this.pairGamesQueryRepository.getMyActiveOrPendingGame(userId);
  //
  //   return this.pairGameQueryService.getPairGameViewData(currentGame);
  // }
  async execute({
    userId,
  }: GetMyCurrentPairGameQuery): Promise<PairGameMapper> {
    let game: PairGame =
      await this.pairGamesQueryRepository.getMyActiveOrPendingGame(userId);

    if (
      game.status === GameStatusEnum.Active &&
      game.expiredActiveGame &&
      game.expiredActiveGame <= new Date()
    ) {
      await this.pairGamesService.finishGameAndAssignBonus(game);

      game = await this.pairGamesQueryRepository.getMyActiveOrPendingGame(
        game.id,
      );
    }

    return this.pairGameQueryService.getPairGameViewData(game);
  }
}
