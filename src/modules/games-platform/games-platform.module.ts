import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateQuestionUseCase } from './questions/application/usecases/create-question.usecase';
import { UpdateQuestionUseCase } from './questions/application/usecases/update-question.usecase';
import { UpdatePublishUseCase } from './questions/application/usecases/update-publish.usecase';
import { RemoveQuestionUseCase } from './questions/application/usecases/remove-question.usecase';
import { GetQuestionByIdQueryHandler } from './questions/application/queries/get-question-by-id.query';
import { GelAllQuestionsQueryHandler } from './questions/application/queries/gel-all-questions.query';
import { QuizQuestion } from './questions/entities/quiz-question.entity';
import { QuizQuestionsController } from './questions/quiz-questions.controller';
import { QuizQuestionsSaController } from './questions/quiz-questions-sa.controller';
import { QuizQuestionsService } from './questions/application/quiz-questions.service';
import { QuizQuestionRepository } from './questions/repositories/quiz-question,repository';
import { QuizQuestionQueryRepository } from './questions/repositories/quiz-question.query,repository';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  UpdatePublishUseCase,
  RemoveQuestionUseCase,
  GetQuestionByIdQueryHandler,
  GelAllQuestionsQueryHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestion])],
  controllers: [QuizQuestionsController, QuizQuestionsSaController],
  providers: [
    ...useCases,
    QuizQuestionsService,
    QuizQuestionRepository,
    QuizQuestionQueryRepository,
  ],
})
export class GamesPlatformModule {}
