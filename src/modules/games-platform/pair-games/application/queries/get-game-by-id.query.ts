import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { PairGameMapper } from '../../mappers/pair-game.mapper';
import { PairGamesQueryService } from '../pair-games.query.service';

export class GetGameByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}

@QueryHandler(GetGameByIdQuery)
export class GetGameByIdQueryHandler implements IQueryHandler<GetGameByIdQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
    private readonly pairGameQueryService: PairGamesQueryService,
  ) {}

  async execute({ userId, id }: GetGameByIdQuery): Promise<PairGameMapper> {
    const currentGame: PairGame =
      await this.pairGamesQueryRepository.getGameById(id);

    if (
      currentGame.firstPlayerId !== userId &&
      currentGame.secondPlayerId !== userId
    ) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message:
              'Access denied: current user is not a participant of the requested game',
            field: 'Game',
          },
        ],
      });
    }

    return this.pairGameQueryService.getPairGameViewData(currentGame);
  }
}
