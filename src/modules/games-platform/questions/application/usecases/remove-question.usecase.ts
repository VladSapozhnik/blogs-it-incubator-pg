import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionRepository } from '../../repositories/quiz-question.repository';

export class RemoveQuestionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveQuestionCommand)
export class RemoveQuestionUseCase implements ICommandHandler<RemoveQuestionCommand> {
  constructor(
    private readonly quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ id }: RemoveQuestionCommand): Promise<void> {
    await this.quizQuestionRepository.findQuestionById(id);
    await this.quizQuestionRepository.removeQuestionById(id);
  }
}
