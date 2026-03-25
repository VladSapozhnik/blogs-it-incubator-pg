import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class QuizQuestionExternalRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private readonly quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  async getRandomQuestionsId(): Promise<string[]> {
    const questions: QuizQuestion[] = await this.quizQuestionRepository
      .createQueryBuilder('question')
      .select('question.id AS id')
      .where('published = :published', { published: true })
      .orderBy('RANDOM()')
      .take(5)
      .getMany();

    return questions.map((question: QuizQuestion) => question.id);
  }

  async getQuestionsByIds(ids: string[]): Promise<QuizQuestion[]> {
    return this.quizQuestionRepository.findBy({ id: In(ids) });
  }
}
