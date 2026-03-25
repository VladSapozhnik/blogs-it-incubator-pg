import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { QuizQuestionExternalRepository } from '../../../questions/repositories/quiz-question.external,repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { GameStatusEnum } from '../../enums/game-status.enum';

export class ConnectCurrentUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(ConnectCurrentUserCommand)
export class ConnectCurrentUserUseCase implements ICommandHandler<ConnectCurrentUserCommand> {
  constructor(
    private readonly pairGamesRepository: PairGamesRepository,
    private readonly quizQuestionExternalRepository: QuizQuestionExternalRepository,
  ) {}

  async execute({ userId }: ConnectCurrentUserCommand): Promise<string> {
    const existPairGame: PairGame | null =
      await this.pairGamesRepository.getPairGameStatus(userId);

    if (existPairGame?.status === GameStatusEnum.Active) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'User is already participating in an active pair game',
            field: 'Pair game',
          },
        ],
      });
    }

    if (!existPairGame) {
      const newPairGame: PairGame = PairGame.createInstance(userId);

      return this.pairGamesRepository.savePairGame(newPairGame);
    }

    if (existPairGame.secondPlayerId === userId) {
      return existPairGame.id;
    }

    const questionIds: string[] =
      await this.quizQuestionExternalRepository.getRandomQuestionsId();

    existPairGame.joinPendingGame(userId);
    existPairGame.addQuestionsIds(questionIds);

    return this.pairGamesRepository.savePairGame(existPairGame);
  }
}
