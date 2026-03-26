import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { In, Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { PlayerAnswer } from '../entities/player-answer.entity';

@Injectable()
export class PairGamesRepository {
  constructor(
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
    return this.pairGameRepository
      .createQueryBuilder('g')
      .setLock('pessimistic_write') // КРИТИЧНО: предотвращает одновременный захват одного слота двумя игроками
      .where('g.status = :status', {
        status: GameStatusEnum.PendingSecondPlayer,
      })
      .andWhere('g.firstPlayerId != :userId', { userId })
      .getOne();
  }

  async getGameStatusActive(playerId: string): Promise<PairGame> {
    const existGame = await this.pairGameRepository.findOne({
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
