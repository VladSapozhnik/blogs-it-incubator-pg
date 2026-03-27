import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizQuestionQueryRepository } from '../../repositories/quiz-question.query.repository';
import { QuizQuestionMapper } from '../../mappers/quiz-question.mapper';

export class GetQuestionByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetQuestionByIdQuery)
export class GetQuestionByIdQueryHandler implements IQueryHandler<GetQuestionByIdQuery> {
  constructor(
    private readonly quizQuestionQueryRepository: QuizQuestionQueryRepository,
  ) {}
  async execute({ id }: GetQuestionByIdQuery): Promise<QuizQuestionMapper> {
    return this.quizQuestionQueryRepository.findQuestionById(id);
  }
}
