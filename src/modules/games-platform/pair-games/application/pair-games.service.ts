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
    // 1. Атомарная проверка: если игра уже Finished, выходим
    // (Это защитит от двойного вызова из UseCase)
    if (game.status === GameStatusEnum.Finished) return;

    // 2. Достаем ПЯТЫЕ ответы (используй тот метод с skip: 4, который мы обсудили)
    const fifthP1 = await this.playerAnswerRepository.getFifthAnswer(
      game.id,
      game.firstPlayerId,
    );
    const fifthP2 = await this.playerAnswerRepository.getFifthAnswer(
      game.id,
      game.secondPlayerId!,
    );

    if (fifthP1 && fifthP2) {
      // Сравниваем время завершения
      const p1FinishedFirst =
        fifthP1.addedAt.getTime() < fifthP2.addedAt.getTime();
      const fastPlayerId = p1FinishedFirst
        ? game.firstPlayerId
        : game.secondPlayerId!;

      // 3. Проверка на наличие правильных ответов
      const hasCorrect = await this.playerAnswerRepository.hasCorrectAnswers(
        game.id,
        fastPlayerId,
      );

      if (hasCorrect) {
        const progress = await this.playerProgressRepository.getPlayerProgress(
          game.id,
          fastPlayerId,
        );
        if (progress) {
          progress.score += 1; // +1 бонусный балл
          await this.playerProgressRepository.savePlayerProgress(progress);
        }
      }
    }

    // 4. ЗАКРЫВАЕМ ИГРУ
    game.finishGame();

    // Сохраняем статус в базу
    await this.pairGameRepository.savePairGame(game);
  }
}
