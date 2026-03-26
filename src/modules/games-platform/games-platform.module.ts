import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateQuestionUseCase } from './questions/application/usecases/create-question.usecase';
import { UpdateQuestionUseCase } from './questions/application/usecases/update-question.usecase';
import { UpdatePublishUseCase } from './questions/application/usecases/update-publish.usecase';
import { RemoveQuestionUseCase } from './questions/application/usecases/remove-question.usecase';
import { GetQuestionByIdQueryHandler } from './questions/application/queries/get-question-by-id.query';
import { GelAllQuestionsQueryHandler } from './questions/application/queries/gel-all-questions.query';
import { QuizQuestion } from './questions/entities/quiz-question.entity';
import { QuizQuestionsSaController } from './questions/quiz-questions-sa.controller';
import { QuizQuestionsService } from './questions/application/quiz-questions.service';
import { QuizQuestionRepository } from './questions/repositories/quiz-question,repository';
import { QuizQuestionQueryRepository } from './questions/repositories/quiz-question.query,repository';
import { PairGamesController } from './pair-games/pair-games.controller';
import { PairGamesService } from './pair-games/application/pair-games.service';
import { PairGamesRepository } from './pair-games/repositories/pair-games.repository';
import { PairGamesQueryRepository } from './pair-games/repositories/pair-games.query.repository';
import { ConnectCurrentUserUseCase } from './pair-games/application/usecases/connect-current-user.usecase';
import { SendNextAnswerUseCase } from './pair-games/application/usecases/send-next-answer.usecase';
import { GetGameByIdQueryHandler } from './pair-games/application/queries/get-game-by-id.query';
import { GetMyCurrentPairGameQueryHandler } from './pair-games/application/queries/get-my-current-pair-game.query';
import { PairGame } from './pair-games/entities/pair-game.entity';
import { PlayerAnswer } from './pair-games/entities/player-answer.entity';
import { QuizQuestionQueryExternalRepository } from './questions/repositories/quiz-question.query.external,repository';
import { PlayerProgress } from './pair-games/entities/player-progress.entity';
import { PlayerAnswerService } from './pair-games/application/player-answer.service';
import { PlayerAnswerRepository } from './pair-games/repositories/player-answer.repository';
import { PlayerProgressRepository } from './pair-games/repositories/player-progress.repository';
import { GetPlayerAnswerByIdQueryHandler } from './pair-games/application/queries/get-player-answer-by-id.query';
import { PlayerAnswerQueryRepository } from './pair-games/repositories/player-answer.query.repository';
import { PlayerProgressQueryRepository } from './pair-games/repositories/player-progress.query.repository';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  UpdatePublishUseCase,
  RemoveQuestionUseCase,
  GetQuestionByIdQueryHandler,
  GelAllQuestionsQueryHandler,
  ConnectCurrentUserUseCase,
  SendNextAnswerUseCase,
  GetGameByIdQueryHandler,
  GetMyCurrentPairGameQueryHandler,
  GetPlayerAnswerByIdQueryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizQuestion,
      PairGame,
      PlayerAnswer,
      PlayerProgress,
    ]),
  ],
  controllers: [QuizQuestionsSaController, PairGamesController],
  providers: [
    ...useCases,
    QuizQuestionsService,
    QuizQuestionRepository,
    QuizQuestionQueryRepository,
    QuizQuestionQueryExternalRepository,
    PairGamesService,
    PairGamesRepository,
    PairGamesQueryRepository,
    PlayerAnswerService,
    PlayerAnswerRepository,
    PlayerAnswerQueryRepository,
    PlayerProgressRepository,
    PlayerProgressQueryRepository,
  ],
})
export class GamesPlatformModule {}
