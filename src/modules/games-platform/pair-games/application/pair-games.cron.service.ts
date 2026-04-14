import { Injectable } from '@nestjs/common';
import { PairGamesRepository } from '../repositories/pair-games.repository';
import { PairGame } from '../entities/pair-game.entity';
import { PairGamesService } from './pair-games.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PairGamesCronService {
  constructor(
    private readonly pairGamesRepository: PairGamesRepository,
    private readonly pairGamesService: PairGamesService,
  ) {}
  @Cron('* * * * * *')
  async finishExpiredGames(): Promise<void> {
    const expiredGames: PairGame[] =
      await this.pairGamesRepository.findExpiredActiveGames();

    for (const game of expiredGames) {
      await this.pairGamesService.finishGameAndAssignBonus(game);
    }
  }
}
