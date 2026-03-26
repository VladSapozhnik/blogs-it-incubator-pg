import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizQuestionMapper } from '../../mappers/quiz-question.mapper';
import { QuizQuestionQueryRepository } from '../../repositories/quiz-question.query.repository';
import { GetQuizQuestionQueryInputDto } from '../../dto/quiz-question-query-input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';

export class GetAllQuestionsQuery {
  constructor(public readonly queryDto: GetQuizQuestionQueryInputDto) {}
}

@QueryHandler(GetAllQuestionsQuery)
export class GelAllQuestionsQueryHandler implements IQueryHandler<GetAllQuestionsQuery> {
  constructor(
    private readonly quizQuestionQueryRepository: QuizQuestionQueryRepository,
  ) {}

  async execute({
    queryDto,
  }: GetAllQuestionsQuery): Promise<PaginatedViewDto<QuizQuestionMapper[]>> {
    return this.quizQuestionQueryRepository.getAllQuestions(queryDto);
  }
}
