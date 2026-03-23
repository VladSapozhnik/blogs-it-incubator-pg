import { CreateQuizQuestionDto } from '../../dto/create-quiz-question.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from '../../repositories/quiz-question,repository';
import { QuizQuestion } from '../../entities/quiz-question.entity';

export class CreateQuestionCommand {
  constructor(public readonly dto: CreateQuizQuestionDto) {}
}

@CommandHandler(CreateQuizQuestionDto)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
  constructor(
    private readonly quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ dto }: CreateQuestionCommand): Promise<string> {
    const question: QuizQuestion = QuizQuestion.createInstance(dto);

    return this.quizQuestionRepository.saveQuizQuestion(question);
  }
}
