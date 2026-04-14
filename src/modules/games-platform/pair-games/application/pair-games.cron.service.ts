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
    const now = new Date();

    const expiredGames: PairGame[] =
      await this.pairGamesRepository.findExpiredActiveGames();

    if (expiredGames.length > 0) {
      console.log(
        `[CRON] Found ${expiredGames.length} games to finish at ${now.toISOString()}`,
      );
    }

    for (const game of expiredGames) {
      console.log(
        `[CRON] Finishing game ${game.id}. Deadline was: ${game.finishGameDate?.toISOString()}`,
      );
      await this.pairGamesService.finishGameAndAssignBonus(game);
    }
  }
}
