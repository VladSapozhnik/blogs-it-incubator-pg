import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from '../../repositories/quiz-question,repository';
import { QuizQuestion } from '../../entities/quiz-question.entity';
import { UpdateQuizQuestionDto } from '../../dto/update-quiz-question.dto';

export class UpdateQuestionCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateQuizQuestionDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
  constructor(
    private readonly quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ id, dto }: UpdateQuestionCommand): Promise<void> {
    const question: QuizQuestion =
      await this.quizQuestionRepository.findQuestionById(id);

    question.updateQuestion(dto);

    await this.quizQuestionRepository.saveQuizQuestion(question);
  }
}
