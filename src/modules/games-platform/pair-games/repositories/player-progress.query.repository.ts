import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerProgress } from '../entities/player-progress.entity';

@Injectable()
export class PlayerProgressQueryRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private readonly playerProgressRepository: Repository<PlayerProgress>,
  ) {}
  async getPlayerProgress(
    gameId: string,
    playerId: string,
  ): Promise<PlayerProgress | null> {
    return this.playerProgressRepository.findOne({
      where: {
        gameId: gameId,
        playerId: playerId,
      },
    });
  }

  async getPlayerProgressByIds(gameIds: string[]): Promise<PlayerProgress[]> {
    return this.playerProgressRepository.find({
      where: { gameId: In(gameIds) },
    });
  }
}
