import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerProgress } from '../entities/player-progress.entity';

@Injectable()
export class PlayerProgressRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private readonly playerProgressRepository: Repository<PlayerProgress>,
  ) {}

  async savePlayerProgress(playerProgress: PlayerProgress): Promise<string> {
    await this.playerProgressRepository.save(playerProgress);

    return playerProgress.id;
  }

  async savePlayersProgress(playerProgress: PlayerProgress[]): Promise<void> {
    await this.playerProgressRepository.save(playerProgress);
  }

  async getPlayerProgress(
    gameId: string,
    playerId: string,
  ): Promise<PlayerProgress | null> {
    return await this.playerProgressRepository.findOne({
      where: {
        gameId: gameId,
        playerId: playerId,
      },
    });
  }

  async getPlayerProgressLock(gameId: string, fastPlayerId: string) {
    return this.playerProgressRepository
      .createQueryBuilder('p')
      .setLock('pessimistic_write')
      .where('p.gameId = :gameId AND p.playerId = :playerId', {
        gameId: gameId,
        playerId: fastPlayerId,
      })
      .getOne();
  }
}
