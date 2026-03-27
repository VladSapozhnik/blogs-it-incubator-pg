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
import { QuizQuestionQueryRepository } from './questions/repositories/quiz-question.query.repository';
import { QuizQuestionQueryExternalRepository } from './questions/repositories/quiz-question.query.external,repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  UpdatePublishUseCase,
  RemoveQuestionUseCase,
  GetQuestionByIdQueryHandler,
  GelAllQuestionsQueryHandler,
  // ConnectCurrentUserUseCase,
  // SendNextAnswerUseCase,
  // GetGameByIdQueryHandler,
  // GetMyCurrentPairGameQueryHandler,
  // GetPlayerAnswerByIdQueryHandler,
  // GetGameQueryHandler,
];

@Module({
  imports: [
    UserAccountsModule,
    TypeOrmModule.forFeature([
      QuizQuestion,
      // PairGame,
      // PlayerAnswer,
      // PlayerProgress,
    ]),
  ],
  controllers: [
    QuizQuestionsSaController,
    // PairGamesController
  ],
  providers: [
    ...useCases,
    QuizQuestionsService,
    QuizQuestionRepository,
    QuizQuestionQueryRepository,
    QuizQuestionQueryExternalRepository,
    // PairGamesService,
    // PairGamesQueryService,
    // PairGamesRepository,
    // PairGamesQueryRepository,
    // PlayerAnswerService,
    // PlayerAnswerRepository,
    // PlayerAnswerQueryRepository,
    // PlayerProgressRepository,
    // PlayerProgressQueryRepository,
  ],
})
export class GamesPlatformModule {}
