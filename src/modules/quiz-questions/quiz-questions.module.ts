import { Module } from '@nestjs/common';
import { QuizQuestionsService } from './application/quiz-questions.service';
import { QuizQuestionsController } from './quiz-questions.controller';
import { QuizQuestionsSaController } from './quiz-questions-sa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestion } from './entities/quiz-question.entity';
import { CreateQuestionUseCase } from './application/usecases/create-question.usecase';
import { QuizQuestionRepository } from './repositories/quiz-question,repository';
import { UpdateQuestionUseCase } from './application/usecases/update-question.usecase';
import { UpdatePublishUseCase } from './application/usecases/update-publish.usecase';
import { RemoveQuestionUseCase } from './application/usecases/remove-question.usecase';
import { GetQuestionByIdQueryHandler } from './application/queries/get-question-by-id.query';
import { GelAllQuestionsQueryHandler } from './application/queries/gel-all-questions.usecase';
import { QuizQuestionQueryRepository } from './repositories/quiz-question.query,repository';

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
export class QuizQuestionsModule {}
