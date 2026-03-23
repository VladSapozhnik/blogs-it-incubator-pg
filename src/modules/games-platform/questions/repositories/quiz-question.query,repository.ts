import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { Repository } from 'typeorm';
import { QuizQuestionMapper } from '../mappers/quiz-question.mapper';
import { GetQuizQuestionQueryInputDto } from '../dto/quiz-question-query-input.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class QuizQuestionQueryRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  async findQuestionById(id: string): Promise<QuizQuestionMapper> {
    const question: QuizQuestion | null =
      await this.quizQuestionRepository.findOneBy({ id });

    if (!question) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Question not found',
            field: 'Question',
          },
        ],
      });
    }

    return QuizQuestionMapper.mapToView(question);
  }

  async getAllQuestions(
    queryDto: GetQuizQuestionQueryInputDto,
  ): Promise<QuizQuestionMapper[]> {
    console.log(queryDto);
    const questions: QuizQuestion[] = await this.quizQuestionRepository.find();

    return questions.map(QuizQuestionMapper.mapToView);
  }
}
