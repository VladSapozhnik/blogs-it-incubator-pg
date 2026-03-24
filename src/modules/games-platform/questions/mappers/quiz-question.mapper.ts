import { QuizQuestion } from '../entities/quiz-question.entity';

export class QuizQuestionMapper {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt?: string;

  static mapToView(this: void, quizQuestion: QuizQuestion): QuizQuestionMapper {
    const dto = new QuizQuestionMapper();

    dto.id = quizQuestion.id;
    dto.body = quizQuestion.body;
    dto.correctAnswers = quizQuestion.correctAnswers;
    dto.published = quizQuestion.published;
    dto.createdAt = quizQuestion.createdAt.toISOString();
    dto.updatedAt = quizQuestion.updatedAt.toISOString() ?? null;

    return dto;
  }
}
