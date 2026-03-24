import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';

export class ConnectCurrentUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(ConnectCurrentUserCommand)
export class ConnectCurrentUserUseCase implements ICommandHandler<ConnectCurrentUserCommand> {
  constructor(private readonly pairGamesRepository: PairGamesRepository) {}

  async execute({ userId }: ConnectCurrentUserCommand): Promise<void> {}
}
