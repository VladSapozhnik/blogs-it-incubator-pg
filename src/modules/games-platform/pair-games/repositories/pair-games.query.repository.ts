import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairGame } from '../entities/pair-game.entity';
import { In, Repository } from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PairGamesQueryRepository {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairGameRepository: Repository<PairGame>,
  ) {}
  async getMyGame(userId: string): Promise<PairGame> {
    const statusCondition = {
      status: In([GameStatusEnum.Active, GameStatusEnum.PendingSecondPlayer]),
    };

    const existGame: PairGame | null = await this.pairGameRepository.findOne({
      where: [
        {
          ...statusCondition,
          firstPlayerId: userId,
        },
        {
          ...statusCondition,
          secondPlayerId: userId,
        },
      ],
    });

    if (!existGame) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Pair game not found',
            field: 'PairGame',
          },
        ],
      });
    }

    return existGame;
  }
}
