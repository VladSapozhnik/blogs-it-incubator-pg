import { Injectable } from '@nestjs/common';
import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswerRepository } from '../repositories/player-answer.repository';
import { PairGamesRepository } from '../repositories/pair-games.repository';
import { PlayerProgressRepository } from '../repositories/player-progress.repository';
import { GameStatusEnum } from '../enums/game-status.enum';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { PlayerProgress } from '../entities/player-progress.entity';

@Injectable()
export class PairGamesService {
  constructor(
    private readonly playerAnswerRepository: PlayerAnswerRepository,
    private readonly pairGameRepository: PairGamesRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
  ) {}
  // async finishGameAndAssignBonus(game: PairGame) {
  //   if (game.status === GameStatusEnum.Finished) return;
  //
  //   const fifthP1 = await this.playerAnswerRepository.getFifthAnswer(
  //     game.id,
  //     game.firstPlayerId,
  //   );
  //   const fifthP2 = await this.playerAnswerRepository.getFifthAnswer(
  //     game.id,
  //     game.secondPlayerId!,
  //   );
  //
  //   if (fifthP1 && fifthP2) {
  //     const p1FinishedFirst: boolean =
  //       fifthP1.addedAt.getTime() < fifthP2.addedAt.getTime();
  //     const fastPlayerId: string = p1FinishedFirst
  //       ? game.firstPlayerId
  //       : game.secondPlayerId!;
  //
  //     const hasCorrect: boolean =
  //       await this.playerAnswerRepository.hasCorrectAnswers(
  //         game.id,
  //         fastPlayerId,
  //       );
  //
  //     if (hasCorrect) {
  //       const progress = await this.playerProgressRepository.getPlayerProgress(
  //         game.id,
  //         fastPlayerId,
  //       );
  //       if (progress) {
  //         progress.incrementScore();
  //         await this.playerProgressRepository.savePlayerProgress(progress);
  //       }
  //     }
  //   }
  //
  //   game.finishGame();
  //
  //   await this.pairGameRepository.savePairGame(game);
  // }

  async finishGameAndAssignBonus(game: PairGame) {
    if (game.status === GameStatusEnum.Finished) return;

    game.finishGame();
    await this.pairGameRepository.savePairGame(game);

    // const fifthP1: PlayerAnswer | null =
    //   await this.playerAnswerRepository.getFifthAnswer(
    //     game.id,
    //     game.firstPlayerId,
    //   );
    //
    // const fifthP2: PlayerAnswer | null =
    //   await this.playerAnswerRepository.getFifthAnswer(
    //     game.id,
    //     game.secondPlayerId!,
    //   );

    const allAnswers: PlayerAnswer[] =
      await this.playerAnswerRepository.getAllAnswers(game.id);

    const p1Answers: PlayerAnswer[] = allAnswers.filter(
      (a) => a.playerId === game.firstPlayerId,
    );
    const p2Answers: PlayerAnswer[] = allAnswers.filter(
      (a) => a.playerId === game.secondPlayerId,
    );

    const p1Finished: boolean = p1Answers.length === 5;
    const p2Finished: boolean = p2Answers.length === 5;

    let fastPlayerId: string | null = null;

    if (p1Finished && p2Finished) {
      fastPlayerId =
        p1Answers[4].addedAt.getTime() < p2Answers[4].addedAt.getTime()
          ? game.firstPlayerId
          : game.secondPlayerId!;
    } else if (p1Finished) {
      fastPlayerId = game.firstPlayerId;
    } else if (p2Finished) {
      fastPlayerId = game.secondPlayerId!;
    }

    if (fastPlayerId) {
      const hasCorrect: boolean =
        await this.playerAnswerRepository.hasCorrectAnswers(
          game.id,
          fastPlayerId,
        );

      if (hasCorrect) {
        const progress: PlayerProgress | null =
          await this.playerProgressRepository.getPlayerProgressLock(
            game.id,
            fastPlayerId,
          );

        if (progress) {
          progress.incrementScore();
          await this.playerProgressRepository.savePlayerProgress(progress);
        }
      }
    }
  }
}
