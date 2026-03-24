import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { Not, Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

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

  async getPairGameStatusPending(userId: string): Promise<PairGame | null> {
    return this.pairGameRepository.findOne({
      where: {
        status: GameStatusEnum.PendingSecondPlayer,
        firstPlayerId: Not(userId),
      },
    });
  }

  async existMyGameStatusActive(userId: string): Promise<boolean> {
    const existMyGame: PairGame | null = await this.pairGameRepository.findOne({
      where: {
        status: GameStatusEnum.Active,
        firstPlayerId: userId,
      },
    });

    if (existMyGame) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'User is already participating in an active pair game',
            field: 'Pair game',
          },
        ],
      });
    }

    return true;
  }
}
