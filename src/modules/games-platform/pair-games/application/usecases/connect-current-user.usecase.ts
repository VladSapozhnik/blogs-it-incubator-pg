import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { QuizQuestionExternalRepository } from '../../../questions/repositories/quiz-question.external,repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { PlayerProgress } from '../../entities/player-progress.entity';
import { PlayerProgressRepository } from '../../repositories/player-progress.repository';

export class ConnectCurrentUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(ConnectCurrentUserCommand)
export class ConnectCurrentUserUseCase implements ICommandHandler<ConnectCurrentUserCommand> {
  constructor(
    private readonly pairGamesRepository: PairGamesRepository,
    private readonly quizQuestionExternalRepository: QuizQuestionExternalRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
  ) {}

  async execute({ userId }: ConnectCurrentUserCommand): Promise<string> {
    const existPairGame: PairGame | null =
      await this.pairGamesRepository.getPairGameStatus(userId);

    if (existPairGame) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          { message: 'User is already in game', field: 'Pair game' },
        ],
      });
    }

    const pendingGame: PairGame | null =
      await this.pairGamesRepository.getGameWaitingForPlayer(userId);

    if (!pendingGame) {
      const newPairGame: PairGame = PairGame.createInstance(userId);
      return this.pairGamesRepository.savePairGame(newPairGame);
    }

    const questionIds: string[] =
      await this.quizQuestionExternalRepository.getRandomQuestionsId();

    pendingGame.joinPendingGame(userId);
    pendingGame.addQuestionsIds(questionIds);

    const gameId: string =
      await this.pairGamesRepository.savePairGame(pendingGame);

    const p1: PlayerProgress = PlayerProgress.createInstance(
      userId,
      pendingGame.id,
    );

    const p2: PlayerProgress = PlayerProgress.createInstance(
      pendingGame.firstPlayerId,
      pendingGame.id,
    );

    await this.playerProgressRepository.savePlayersProgress([p1, p2]);

    return gameId;
  }
}
