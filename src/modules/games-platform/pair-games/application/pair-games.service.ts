import { Injectable } from '@nestjs/common';
import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswerRepository } from '../repositories/player-answer.repository';
import { PairGamesRepository } from '../repositories/pair-games.repository';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { PlayerProgressRepository } from '../repositories/player-progress.repository';
import { PlayerProgress } from '../entities/player-progress.entity';

@Injectable()
export class PairGamesService {
  constructor(
    private readonly playerAnswerRepository: PlayerAnswerRepository,
    private readonly pairGameRepository: PairGamesRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
  ) {}
  async finishGameAndAssignBonus(game: PairGame) {
    const lastAnswerP1: PlayerAnswer | null =
      await this.playerAnswerRepository.getLastAnswer(
        game.id,
        game.firstPlayerId,
      );
    const lastAnswerP2: PlayerAnswer | null =
      await this.playerAnswerRepository.getLastAnswer(
        game.id,
        game.secondPlayerId!,
      );

    if (!lastAnswerP1 || !lastAnswerP2) return;

    const p1IsFaster: boolean = lastAnswerP1.addedAt < lastAnswerP2.addedAt;

    const fastPlayerId: string = p1IsFaster
      ? game.firstPlayerId
      : game.secondPlayerId!;

    const hasCorrectAnswers: boolean =
      await this.playerAnswerRepository.hasCorrectAnswers(
        game.id,
        fastPlayerId,
      );

    if (hasCorrectAnswers) {
      const playerProgress: PlayerProgress | null =
        await this.playerProgressRepository.getPlayerProgress(
          game.id,
          fastPlayerId,
        );

      if (playerProgress) {
        playerProgress.incrementScore();
        await this.playerProgressRepository.savePlayerProgress(playerProgress);
      }
    }

    game.finishGame();

    await this.pairGameRepository.savePairGame(game);
  }
}
