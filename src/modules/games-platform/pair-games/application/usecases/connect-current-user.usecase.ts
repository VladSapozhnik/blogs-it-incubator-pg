import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';
import { PairGame } from '../../entities/pair-game.entity';

export class ConnectCurrentUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(ConnectCurrentUserCommand)
export class ConnectCurrentUserUseCase implements ICommandHandler<ConnectCurrentUserCommand> {
  constructor(private readonly pairGamesRepository: PairGamesRepository) {}

  async execute({ userId }: ConnectCurrentUserCommand): Promise<string> {
    await this.pairGamesRepository.existMyGameStatusActive(userId);

    const existPairGame: PairGame | null =
      await this.pairGamesRepository.getPairGameStatusPending(userId);

    if (!existPairGame) {
      const newPairGame: PairGame = PairGame.createInstance(userId);
      return this.pairGamesRepository.savePairGame(newPairGame);
    }

    existPairGame.joinPendingGame(userId);

    return this.pairGamesRepository.savePairGame(existPairGame);
  }
}
