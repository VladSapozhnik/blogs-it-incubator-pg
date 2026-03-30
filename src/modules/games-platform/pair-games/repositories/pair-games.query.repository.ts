import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserGameHistoryQueryInputDto } from '../dto/user-game-history-query-input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { PairGameMapper } from '../mappers/pair-game.mapper';

@Injectable()
export class PairGamesQueryRepository {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
  ) {}
  async getMyActiveOrPendingGame(playerId: string): Promise<PairGame> {
    const existGame: PairGame | null = await this.pairGameRepository.findOne({
      where: [
        { firstPlayerId: playerId, status: GameStatusEnum.Active },
        { secondPlayerId: playerId, status: GameStatusEnum.Active },
        { firstPlayerId: playerId, status: GameStatusEnum.PendingSecondPlayer },
        {
          secondPlayerId: playerId,
          status: GameStatusEnum.PendingSecondPlayer,
        },
      ],
    });

    if (!existGame) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Game not found',
            field: 'Game',
          },
        ],
      });
    }

    return existGame;
  }

  async getGameById(id: string): Promise<PairGame> {
    const existGame: PairGame | null = await this.pairGameRepository.findOneBy({
      id,
    });

    if (!existGame) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Game not found',
            field: 'Game',
          },
        ],
      });
    }

    return existGame;
  }

  async getUserGameHistory(
    userId: string,
    queryDto: UserGameHistoryQueryInputDto,
  ) {
    const [userGameHistory, totalCount] =
      await this.pairGameRepository.findAndCount({
        where: [
          {
            firstPlayerId: userId,
          },
          {
            secondPlayerId: userId,
          },
        ],
        skip: queryDto.calculateSkip(),
        take: queryDto.pageSize,
        order: {
          [queryDto.sortBy]: queryDto.sortDirection,
        },
      });

    // const items = userGameHistory.map(PairGameMapper.mapToView);
    //
    // return PaginatedViewDto.mapToView({
    //   items,
    //   totalCount,
    //   page: queryDto.pageNumber,
    //   size: queryDto.pageSize,
    // });
  }
}
