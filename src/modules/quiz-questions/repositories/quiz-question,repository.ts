import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { DeleteResult, Repository } from 'typeorm';
import { DomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class QuizQuestionRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  async saveQuizQuestion(quizQuestion: QuizQuestion): Promise<string> {
    await this.quizQuestionRepository.save(quizQuestion);

    return quizQuestion.id;
  }

  async findQuestionById(id: string): Promise<QuizQuestion> {
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

    return question;
  }

  async removeQuestionById(id: string): Promise<boolean> {
    const result: DeleteResult = await this.quizQuestionRepository.delete(id);

    return result.affected === 1;
  }
}
