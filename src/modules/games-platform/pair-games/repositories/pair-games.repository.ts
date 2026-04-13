import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { DataSource, In, LessThanOrEqual, Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PairGamesRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
  ) {}

  async savePairGame(game: PairGame): Promise<string> {
    await this.pairGameRepository.save(game);

    return game.id;
  }

  async getPairGameStatus(playerId: string): Promise<PairGame | null> {
    return this.pairGameRepository.findOne({
      where: [
        {
          firstPlayerId: playerId,
          status: In([
            GameStatusEnum.PendingSecondPlayer,
            GameStatusEnum.Active,
          ]),
        },
        {
          secondPlayerId: playerId,
          status: In([
            GameStatusEnum.PendingSecondPlayer,
            GameStatusEnum.Active,
          ]),
        },
      ],
    });
  }

  async getGameWaitingForPlayer(userId: string): Promise<PairGame | null> {
    return this.dataSource.transaction(async (manager) => {
      return await manager
        .getRepository(PairGame)
        .createQueryBuilder('g')
        .setLock('pessimistic_write') // блокировка записи
        .where('g.status = :status', {
          status: GameStatusEnum.PendingSecondPlayer,
        })
        .andWhere('g.firstPlayerId != :userId', { userId })
        .getOne();
    });
  }

  async getGameStatusActive(playerId: string): Promise<PairGame> {
    const existGame: PairGame | null = await this.pairGameRepository.findOne({
      where: [
        { firstPlayerId: playerId, status: GameStatusEnum.Active },
        { secondPlayerId: playerId, status: GameStatusEnum.Active },
      ],
    });

    if (!existGame) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message:
              'Current user is not inside active pair or user is in active pair but has already answered to all questions',
            field: 'Pair game',
          },
        ],
      });
    }

    return existGame;
  }

  async findExpiredActiveGames(): Promise<PairGame[]> {
    return this.pairGameRepository.find({
      where: {
        status: GameStatusEnum.Active,
        finishGameDate: LessThanOrEqual(new Date()),
      },
    });
  }

  async getGameWithAllData(userId: string) {
    return this.pairGameRepository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.playerAnswers', 'pa')
      .leftJoinAndSelect('g.playerProgresses', 'pp')
      .where('g.status = :status', { status: GameStatusEnum.Active })
      .andWhere('(g.firstPlayerId = :userId OR g.secondPlayerId = :userId)', {
        userId,
      })
      .getOne();
  }
}
