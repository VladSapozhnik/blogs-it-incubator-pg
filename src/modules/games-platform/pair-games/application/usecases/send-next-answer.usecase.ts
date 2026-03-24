import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';

export class SendNextAnswerCommand {
  constructor(
    public readonly userId: string,
    public readonly answer: string,
  ) {}
}

@CommandHandler(SendNextAnswerCommand)
export class SendNextAnswerUseCase implements ICommandHandler<SendNextAnswerCommand> {
  constructor(private readonly pairGamesRepository: PairGamesRepository) {}

  async execute({ userId, answer }: SendNextAnswerCommand): Promise<void> {}
}
