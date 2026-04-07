import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserGameHistoryQueryInputDto } from '../dto/user-game-history-query-input.dto';
import { StatisticsMapper } from '../mappers/statistics.mapper';
import { SortDirection } from '../../../../core/dto/base.query-params.input.dto';
import { TopUsersQueryInputDto } from '../dto/top-users-query-input.dto';
import { PostWithStatusRowType } from '../../../bloggers-platform/posts/types/post-with-status-row.type';
import { TopUsersRowType } from '../types/top-users-row.type';

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

  async getUserGameHistoryAndTotal(
    userId: string,
    queryDto: UserGameHistoryQueryInputDto,
  ) {
    return this.pairGameRepository.findAndCount({
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
        pairCreatedDate: SortDirection.Desc,
      },
    });
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

  async getTopUsers(queryDto: TopUsersQueryInputDto) {
    const sort = queryDto.parseSortParams();

    const query = this.pairGameRepository
      .createQueryBuilder('pg')
      .innerJoin('pg.playerProgresses', 'pp')
      .innerJoin('users', 'u', 'u.id = pp.playerId')
      .innerJoin(
        'pg.playerProgresses',
        'opp',
        'opp."gameId" = pp."gameId" AND opp."playerId" != pp."playerId"',
      )
      .select([
        'u.id AS "userId"',
        'u.login AS "userLogin"',
        `COUNT(DISTINCT pg.id)::int AS "gamesCount"`,
        `COALESCE(SUM(pp.score), 0)::int AS "sumScore"`,
        `COALESCE(AVG(pp.score), 0)::float AS "avgScores"`,
        `COUNT(*) FILTER (WHERE pp.score > opp.score)::int AS "winsCount"`,
        `COUNT(*) FILTER (WHERE pp.score < opp.score)::int AS "lossesCount"`,
        `COUNT(*) FILTER (WHERE pp.score = opp.score)::int AS "drawsCount"`,
      ])
      .andWhere(`pg.status = :status`, { status: GameStatusEnum.Finished })
      .groupBy('u.id')
      .addGroupBy('u.login');

    // .select('COUNT(DISTINCT u.id)', 'count')

    const totalCountRaw = (await query
      .clone()
      .select('COALESCE(COUNT(DISTINCT u.id), 0)::int', 'count')
      .getRawOne()) as { count: string };

    const totalCount: number = Number(totalCountRaw?.count ?? 0);

    const topUsers: TopUsersRowType[] = await query
      .orderBy(sort)
      .limit(queryDto.pageSize)
      .offset(queryDto.calculateSkip())
      .getRawMany();

    return {
      topUsers,
      totalCount,
    };
  }
}
