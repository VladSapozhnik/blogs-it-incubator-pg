import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { PairGameMapper } from '../../mappers/pair-game.mapper';
import { PairGamesQueryService } from '../pair-games.query.service';

export class GetGameQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetGameQuery)
export class GetGameQueryHandler implements IQueryHandler<GetGameQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
    private readonly pairGameQueryService: PairGamesQueryService,
  ) {}

  async execute({ id }: GetGameQuery): Promise<PairGameMapper> {
    const currentGame: PairGame =
      await this.pairGamesQueryRepository.getGameById(id);

    return this.pairGameQueryService.getPairGameViewData(currentGame);
  }
}
