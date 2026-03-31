import { Injectable } from '@nestjs/common';
import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { PlayerProgress } from '../entities/player-progress.entity';
import { QuizQuestionQueryExternalRepository } from '../../questions/repositories/quiz-question.query.external.repository';
import { PlayerAnswerQueryRepository } from '../repositories/player-answer.query.repository';
import { PlayerProgressQueryRepository } from '../repositories/player-progress.query.repository';
import { UsersQueryExternalRepository } from '../../../user-accounts/users/repositories/users.query.external.repository';
import { QuizQuestion } from '../../questions/entities/quiz-question.entity';
import { PairGameMapper } from '../mappers/pair-game.mapper';
import { UserLoginMapper } from '../../../user-accounts/users/mappers/user-login.mapper';

@Injectable()
export class PairGamesQueryService {
  constructor(
    private readonly quizQuestionQueryExternalRepository: QuizQuestionQueryExternalRepository,
    private readonly playerAnswerQueryRepository: PlayerAnswerQueryRepository,
    private readonly playerProgressQueryRepository: PlayerProgressQueryRepository,
    private readonly usersQueryExternalRepository: UsersQueryExternalRepository,
  ) {}

  async getPairGameViewData(currentGame: PairGame): Promise<PairGameMapper> {
    const question: QuizQuestion[] =
      await this.quizQuestionQueryExternalRepository.getQuestionsByIds(
        currentGame.questionsIds,
      );

    const firstAnswers: PlayerAnswer[] =
      await this.playerAnswerQueryRepository.getAnswerByPlayerId(
        currentGame.questionsIds,
        currentGame.id,
        currentGame.firstPlayerId,
      );

    const secondAnswers: PlayerAnswer[] = currentGame.secondPlayerId
      ? await this.playerAnswerQueryRepository.getAnswerByPlayerId(
          currentGame.questionsIds,
          currentGame.id,
          currentGame.secondPlayerId,
        )
      : [];

    const firstProgress: PlayerProgress | null =
      await this.playerProgressQueryRepository.getPlayerProgress(
        currentGame.id,
        currentGame.firstPlayerId,
      );

    const secondProgress: PlayerProgress | null = currentGame.secondPlayerId
      ? await this.playerProgressQueryRepository.getPlayerProgress(
          currentGame.id,
          currentGame.secondPlayerId,
        )
      : null;

    const firstPlayer: UserLoginMapper | null =
      await this.usersQueryExternalRepository.getUserLogin(
        currentGame.firstPlayerId,
      );
    const secondPlayer: UserLoginMapper | null = currentGame.secondPlayerId
      ? await this.usersQueryExternalRepository.getUserLogin(
          currentGame.secondPlayerId,
        )
      : null;

    return PairGameMapper.mapToView(
      currentGame,
      question,
      firstAnswers,
      secondAnswers,
      firstProgress?.score ?? 0,
      secondProgress?.score ?? 0,
      firstPlayer!.login,
      secondPlayer?.login ?? null,
    );
  }
}
