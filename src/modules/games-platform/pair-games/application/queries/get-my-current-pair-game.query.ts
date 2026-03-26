import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { QuizQuestionQueryExternalRepository } from '../../../questions/repositories/quiz-question.query.external,repository';
import { QuizQuestion } from '../../../questions/entities/quiz-question.entity';
import { PlayerAnswerQueryRepository } from '../../repositories/player-answer.query.repository';
import { PlayerAnswer } from '../../entities/player-answer.entity';
import { PlayerProgressQueryRepository } from '../../repositories/player-progress.query.repository';
import { PlayerProgress } from '../../entities/player-progress.entity';

export class GetMyCurrentPairGameQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyCurrentPairGameQuery)
export class GetMyCurrentPairGameQueryHandler implements IQueryHandler<GetMyCurrentPairGameQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
    private readonly quizQuestionQueryExternalRepository: QuizQuestionQueryExternalRepository,
    private readonly playerAnswerQueryRepository: PlayerAnswerQueryRepository,
    private readonly playerProgressQueryRepository: PlayerProgressQueryRepository,
  ) {}

  async execute({ userId }: GetMyCurrentPairGameQuery) {
    const correctGame: PairGame =
      await this.pairGamesQueryRepository.getMyActiveGame(userId);

    const quizQuestion: QuizQuestion[] =
      await this.quizQuestionQueryExternalRepository.getQuestionsByIds(
        correctGame.questionsIds,
      );

    const firstAnswers: PlayerAnswer[] =
      await this.playerAnswerQueryRepository.getAllPlayerAnswer(
        correctGame.questionsIds,
        correctGame.id,
        correctGame.firstPlayerId,
      );

    const secondAnswers: PlayerAnswer[] = correctGame.secondPlayerId
      ? await this.playerAnswerQueryRepository.getAllPlayerAnswer(
          correctGame.questionsIds,
          correctGame.id,
          correctGame.secondPlayerId,
        )
      : [];

    const firstProgress: PlayerProgress | null =
      await this.playerProgressQueryRepository.getPlayerProgress(
        correctGame.id,
        correctGame.firstPlayerId,
      );

    const secondProgress: PlayerProgress | null = correctGame.secondPlayerId
      ? await this.playerProgressQueryRepository.getPlayerProgress(
          correctGame.id,
          correctGame.secondPlayerId,
        )
      : null;

    // return PairGameViewDto.mapToView(
    //   correctGame,
    //   quizQuestion,
    //   firstAnswers,
    //   secondAnswers,
    //   firstProgress?.score ?? 0,
    //   secondProgress?.score ?? 0,
    //   firstLogin,
    //   secondLogin,
    // );

    return correctGame.id;
  }
}
