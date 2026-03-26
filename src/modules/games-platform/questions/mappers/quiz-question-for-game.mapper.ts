import { QuizQuestion } from '../entities/quiz-question.entity';

export class QuizQuestionForGameMapper {
  id: string;
  body: string;

  static mapToView(
    this: void,
    quizQuestion: QuizQuestion,
  ): QuizQuestionForGameMapper {
    const dto = new QuizQuestionForGameMapper();

    dto.id = quizQuestion.id;
    dto.body = quizQuestion.body;

    return dto;
  }
}
