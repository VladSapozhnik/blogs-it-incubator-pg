import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  async getAllPlayerAnswer(
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

  async countCorrectAnswers(gameId: string, userId: string): Promise<number> {
    return this.playerAnswerRepository.count({
      where: { gameId, playerId: userId },
    });
  }

  async getLastAnswer(
    gameId: string,
    userId: string,
  ): Promise<PlayerAnswer | null> {
    return this.playerAnswerRepository.findOne({
      where: { gameId, playerId: userId },
      order: { addedAt: 'DESC' },
    });
  }

  async hasCorrectAnswers(gameId: string, playerId: string): Promise<boolean> {
    const count = await this.playerAnswerRepository.count({
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
