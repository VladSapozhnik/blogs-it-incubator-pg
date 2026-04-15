import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerStatusEnum } from '../enums/answer-status.enum';

@Injectable()
export class PlayerAnswerRepository {
  constructor(
    @InjectRepository(PlayerAnswer)
    private readonly playerAnswerRepository: Repository<PlayerAnswer>,
  ) {}

  async savePlayerAnswer(playerAnswer: PlayerAnswer): Promise<string> {
    await this.playerAnswerRepository.save(playerAnswer);

    return playerAnswer.id;
  }

  async getPlayerAnswer(
    gameId: string,
    playerId: string,
  ): Promise<PlayerAnswer[]> {
    return this.playerAnswerRepository.find({
      where: {
        gameId,
        playerId,
      },
      order: {
        addedAt: 'ASC',
      },
    });
  }

  async getCountByGameAndUser(
    playerId: string,
    gameId: string,
  ): Promise<number> {
    return this.playerAnswerRepository.count({
      where: { playerId, gameId },
    });
  }

  async hasCorrectAnswers(gameId: string, playerId: string): Promise<boolean> {
    const count: number = await this.playerAnswerRepository.count({
      where: {
        gameId,
        playerId,
        answerStatus: AnswerStatusEnum.Correct,
      },
    });
    return count > 0;
  }

  async countAnswers(gameId: string, playerId: string): Promise<number> {
    return await this.playerAnswerRepository.count({
      where: {
        gameId: gameId,
        playerId: playerId,
      },
    });
  }

  async getAllAnswers(gameId: string): Promise<PlayerAnswer[]> {
    return this.playerAnswerRepository
      .createQueryBuilder('a')
      .where('a.gameId = :gameId', { gameId: gameId })
      .orderBy('a.addedAt', 'ASC')
      .getMany();
  }

  async getFifthAnswer(
    gameId: string,
    playerId: string,
  ): Promise<PlayerAnswer | null> {
    const answers: PlayerAnswer[] = await this.playerAnswerRepository.find({
      where: { gameId, playerId },
      order: { addedAt: 'ASC' },
      skip: 4,
      take: 1,
    });

    return answers[0] ?? null;
  }
}
