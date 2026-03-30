import { Injectable } from '@nestjs/common';
import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswerRepository } from '../repositories/player-answer.repository';
import { PairGamesRepository } from '../repositories/pair-games.repository';
import { PlayerProgressRepository } from '../repositories/player-progress.repository';
import { GameStatusEnum } from '../enums/game-status.enum';

@Injectable()
export class PairGamesService {
  constructor(
    private readonly playerAnswerRepository: PlayerAnswerRepository,
    private readonly pairGameRepository: PairGamesRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
  ) {}
  async finishGameAndAssignBonus(game: PairGame) {
    if (game.status === GameStatusEnum.Finished) return;

    const fifthP1 = await this.playerAnswerRepository.getFifthAnswer(
      game.id,
      game.firstPlayerId,
    );
    const fifthP2 = await this.playerAnswerRepository.getFifthAnswer(
      game.id,
      game.secondPlayerId!,
    );

    if (fifthP1 && fifthP2) {
      const p1FinishedFirst: boolean =
        fifthP1.addedAt.getTime() < fifthP2.addedAt.getTime();
      const fastPlayerId: string = p1FinishedFirst
        ? game.firstPlayerId
        : game.secondPlayerId!;

      const hasCorrect: boolean =
        await this.playerAnswerRepository.hasCorrectAnswers(
          game.id,
          fastPlayerId,
        );

      if (hasCorrect) {
        const progress = await this.playerProgressRepository.getPlayerProgress(
          game.id,
          fastPlayerId,
        );
        if (progress) {
          progress.incrementScore();
          await this.playerProgressRepository.savePlayerProgress(progress);
        }
      }
    }

    game.finishGame();

    await this.pairGameRepository.savePairGame(game);
  }
}
