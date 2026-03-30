import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserGameHistoryQueryInputDto } from '../dto/user-game-history-query-input.dto';
import { StatisticsMapper } from '../mappers/statistics.mapper';

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

  async getUserGameStatistics(userId: string): Promise<StatisticsMapper> {
    const result = (await this.pairGameRepository
      .createQueryBuilder('pg')
      .innerJoin('pg.playerProgresses', 'pp')
      .innerJoin(
        'pg.playerProgresses',
        'opp',
        'opp."gameId" = pp."gameId" AND opp."playerId" != pp."playerId"',
      )
      .select([
        `COUNT(DISTINCT pg.id)::int AS "gamesCount"`,
        `COALESCE(SUM(pp.score), 0)::int AS "sumScore"`,
        `COALESCE(AVG(pp.score), 0)::float AS "avgScores"`,
        `COUNT(*) FILTER (WHERE pp.score > opp.score)::int AS "winsCount"`,
        `COUNT(*) FILTER (WHERE pp.score < opp.score)::int AS "lossesCount"`,
        `COUNT(*) FILTER (WHERE pp.score = opp.score)::int AS "drawsCount"`,
      ])
      .where(`pp."playerId" = :playerId`, { playerId: userId })
      .andWhere(`pg.status = :status`, { status: GameStatusEnum.Finished })
      .getRawOne()) as StatisticsMapper;

    return StatisticsMapper.mapToView(result);
  }
}
