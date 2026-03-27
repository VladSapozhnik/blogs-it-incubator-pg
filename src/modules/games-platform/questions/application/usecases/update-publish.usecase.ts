import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestion } from '../../entities/quiz-question.entity';
import { QuizQuestionRepository } from '../../repositories/quiz-question.repository';

export class UpdatePublishCommand {
  constructor(
    public readonly id: string,
    public readonly isPublish: boolean,
  ) {}
}

@CommandHandler(UpdatePublishCommand)
export class UpdatePublishUseCase implements ICommandHandler<UpdatePublishCommand> {
  constructor(
    private readonly quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({ id, isPublish }: UpdatePublishCommand): Promise<void> {
    const question: QuizQuestion =
      await this.quizQuestionRepository.findQuestionById(id);

    question.updatePublished(isPublish);

    await this.quizQuestionRepository.saveQuizQuestion(question);
  }
}
