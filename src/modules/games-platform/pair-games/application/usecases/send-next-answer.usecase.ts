import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { QuizQuestionExternalRepository } from '../../../questions/repositories/quiz-question.external,repository';
import { QuizQuestion } from '../../../questions/entities/quiz-question.entity';
import { PlayerAnswer } from '../../entities/player-answer.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

export class SendNextAnswerCommand {
  constructor(
    public readonly userId: string,
    public readonly answer: string,
  ) {}
}

@CommandHandler(SendNextAnswerCommand)
export class SendNextAnswerUseCase implements ICommandHandler<SendNextAnswerCommand> {
  constructor(
    private readonly pairGamesRepository: PairGamesRepository,
    private readonly quizQuestionExternalRepository: QuizQuestionExternalRepository,
  ) {}

  async execute({ userId, answer }: SendNextAnswerCommand): Promise<void> {
    const activeGame: PairGame =
      await this.pairGamesRepository.getGameStatusActive(userId);

    const questions: QuizQuestion[] =
      await this.quizQuestionExternalRepository.getQuestionsByIds(
        activeGame.questionsIds,
      );

    const getAllAnswers: PlayerAnswer[] =
      await this.pairGamesRepository.getAllPlayerAnswer(
        activeGame.questionsIds,
        activeGame.id,
        userId,
      );

    if (getAllAnswers.length === questions.length) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message:
              'Current user is not inside active pair or user is in active pair but has already answered to all questions',
            field: 'Pair game',
          },
        ],
      });
    }

    // const playerAnswers: PlayerAnswer[] = PlayerAnswer.createInstance(
    //   activeGame.id,
    //   userId,
    //   '123',
    //   AnswerStatusEnum.Correct,
    // );
  }
}
