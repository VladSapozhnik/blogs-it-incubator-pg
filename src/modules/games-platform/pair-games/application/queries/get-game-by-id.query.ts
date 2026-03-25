import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

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
  ) {}

  async execute({ userId, id }: GetGameByIdQuery): Promise<PairGame> {
    const existGame: PairGame =
      await this.pairGamesQueryRepository.getGameById(id);

    if (
      existGame.firstPlayerId !== userId ||
      existGame.secondPlayerId !== userId
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

    return existGame;
  }
}
