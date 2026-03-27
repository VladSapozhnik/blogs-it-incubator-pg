import { Injectable } from '@nestjs/common';
import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswerRepository } from '../repositories/player-answer.repository';
import { PairGamesRepository } from '../repositories/pair-games.repository';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { PlayerProgressRepository } from '../repositories/player-progress.repository';
import { PlayerProgress } from '../entities/player-progress.entity';
import { GameStatusEnum } from '../enums/game-status.enum';

@Injectable()
export class PairGamesService {
  constructor(
    private readonly playerAnswerRepository: PlayerAnswerRepository,
    private readonly pairGameRepository: PairGamesRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
  ) {}
  // async finishGameAndAssignBonus(game: PairGame) {
  //   // 1. Получаем количество ответов для каждого
  //   const countP1 = await this.playerAnswerRepository.countAnswers(
  //     game.id,
  //     game.firstPlayerId,
  //   );
  //   const countP2 = await this.playerAnswerRepository.countAnswers(
  //     game.id,
  //     game.secondPlayerId!,
  //   );
  //
  //   // Если оба ответили по 5 раз — игру ПОРА ЗАКРЫВАТЬ
  //   if (countP1 === 5 && countP2 === 5) {
  //     // Вычисляем, кто закончил серию ПЕРВЫМ
  //     // Нам нужно время ПЯТОГО ответа каждого игрока
  //     const fifthAnswerP1 = await this.playerAnswerRepository.getFifthAnswer(
  //       game.id,
  //       game.firstPlayerId,
  //     );
  //     const fifthAnswerP2 = await this.playerAnswerRepository.getFifthAnswer(
  //       game.id,
  //       game.secondPlayerId!,
  //     );
  //
  //     if (fifthAnswerP1 && fifthAnswerP2) {
  //       const p1FinishedFirst = fifthAnswerP1.addedAt < fifthAnswerP2.addedAt;
  //       const fastPlayerId = p1FinishedFirst
  //         ? game.firstPlayerId
  //         : game.secondPlayerId!;
  //
  //       // Проверяем наличие правильных ответов у "быстрого"
  //       const hasCorrect = await this.playerAnswerRepository.hasCorrectAnswers(
  //         game.id,
  //         fastPlayerId,
  //       );
  //
  //       if (hasCorrect) {
  //         // Начисляем +1 балл в прогресс
  //         const progress =
  //           await this.playerProgressRepository.getPlayerProgress(
  //             game.id,
  //             fastPlayerId,
  //           );
  //         if (progress) {
  //           progress.score += 1; // Убедись, что это сохраняется
  //           await this.playerProgressRepository.savePlayerProgress(progress);
  //         }
  //       }
  //     }
  //
  //     // ЗАКРЫВАЕМ ИГРУ
  //     game.status = GameStatusEnum.Finished;
  //     game.finishGameDate = new Date();
  //     await this.pairGameRepository.savePairGame(game);
  //   }
  // }

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
