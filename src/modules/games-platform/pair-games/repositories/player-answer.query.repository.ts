import { HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { PlayerAnswersMapper } from '../mappers/player-answers.mapper';

@Injectable()
export class PlayerAnswerQueryRepository {
  constructor(
    @InjectRepository(PlayerAnswer)
    private readonly playerAnswerRepository: Repository<PlayerAnswer>,
  ) {}

  async getPlayerAnswerById(id: string): Promise<PlayerAnswersMapper> {
    const playerAnswer: PlayerAnswer | null =
      await this.playerAnswerRepository.findOneBy({ id });

    if (!playerAnswer) {
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

    return PlayerAnswersMapper.mapToView(playerAnswer);
  }

  async getAllPlayerAnswer(
    questionsIds: string[],
    gameId: string,
    playerId: string,
  ): Promise<PlayerAnswer[]> {
    return this.playerAnswerRepository.find({
      where: { questionId: In(questionsIds), gameId, playerId },
      order: { addedAt: 'ASC' },
    });
  }
}
