import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairGamesRepository } from '../../repositories/pair-games.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { QuizQuestionQueryExternalRepository } from '../../../questions/repositories/quiz-question.query.external.repository';
import { QuizQuestion } from '../../../questions/entities/quiz-question.entity';
import { PlayerAnswer } from '../../entities/player-answer.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { AnswerStatusEnum } from '../../enums/answer-status.enum';
import { PlayerAnswerRepository } from '../../repositories/player-answer.repository';
import { PlayerProgressRepository } from '../../repositories/player-progress.repository';
import { PlayerProgress } from '../../entities/player-progress.entity';
import { PairGamesService } from '../pair-games.service';

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
    private readonly quizQuestionExternalRepository: QuizQuestionQueryExternalRepository,
    private readonly playerAnswerRepository: PlayerAnswerRepository,
    private readonly playerProgressRepository: PlayerProgressRepository,
    private readonly pairGameService: PairGamesService,
  ) {}

  async execute({ userId, answer }: SendNextAnswerCommand): Promise<string> {
    const activeGame: PairGame =
      await this.pairGamesRepository.getGameStatusActive(userId);

    const questions: QuizQuestion[] =
      await this.quizQuestionExternalRepository.getQuestionsByIds(
        activeGame.questionsIds,
      );

    const answersCount: number =
      await this.playerAnswerRepository.getCountByGameAndUser(
        userId,
        activeGame.id,
      );

    if (answersCount >= questions.length) {
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

    const currentQuestion: QuizQuestion = questions[answersCount];

    const isCorrect: boolean = currentQuestion.correctAnswers.includes(answer);

    const playerAnswers: PlayerAnswer = PlayerAnswer.createInstance(
      activeGame.id,
      userId,
      currentQuestion.id,
      isCorrect ? AnswerStatusEnum.Correct : AnswerStatusEnum.Incorrect,
    );

    const savedAnswerId: string =
      await this.playerAnswerRepository.savePlayerAnswer(playerAnswers);

    if (isCorrect) {
      const getPlayerProgress: PlayerProgress | null =
        await this.playerProgressRepository.getPlayerProgress(
          activeGame.id,
          userId,
        );
      if (getPlayerProgress) {
        getPlayerProgress.incrementScore();
        await this.playerProgressRepository.savePlayerProgress(
          getPlayerProgress,
        );
      }
    }

    const userAnswersCount: number = answersCount + 1;
    const questionsCount: number = questions.length;

    if (userAnswersCount === questionsCount) {
      const opponentId: string =
        activeGame.firstPlayerId === userId
          ? activeGame.secondPlayerId!
          : activeGame.firstPlayerId;

      const opponentAnswersCount: number =
        await this.playerAnswerRepository.getCountByGameAndUser(
          activeGame.id,
          opponentId,
        );

      if (opponentAnswersCount === questionsCount) {
        await this.pairGameService.finishGameAndAssignBonus(activeGame);
      }
    }

    return savedAnswerId;
  }
}

// @CommandHandler(SendNextAnswerCommand)
// export class SendNextAnswerUseCase implements ICommandHandler<SendNextAnswerCommand> {
//   constructor(
//     private readonly pairGamesRepository: PairGamesRepository,
//     private readonly quizQuestionExternalRepository: QuizQuestionQueryExternalRepository,
//     private readonly playerAnswerRepository: PlayerAnswerRepository,
//     private readonly playerProgressRepository: PlayerProgressRepository,
//     private readonly pairGameService: PairGamesService,
//   ) {}
//
//   async execute({ userId, answer }: SendNextAnswerCommand): Promise<string> {
//     const activeGame: PairGame =
//       await this.pairGamesRepository.getGameStatusActive(userId);
//
//     const questions: QuizQuestion[] =
//       await this.quizQuestionExternalRepository.getQuestionsByIds(
//         activeGame.questionsIds,
//       );
//
//     const getAllAnswers: PlayerAnswer[] =
//       await this.playerAnswerRepository.getAllPlayerAnswer(
//         activeGame.questionsIds,
//         activeGame.id,
//         userId,
//       );
//
//     if (getAllAnswers.length === questions.length) {
//       throw new DomainException({
//         status: HttpStatus.FORBIDDEN,
//         errorsMessages: [
//           {
//             message:
//               'Current user is not inside active pair or user is in active pair but has already answered to all questions',
//             field: 'Pair game',
//           },
//         ],
//       });
//     }
//
//     const currentQuestion: QuizQuestion = questions[getAllAnswers.length];
//
//     const isCorrect: boolean = currentQuestion.correctAnswers.includes(answer);
//
//     const playerAnswers: PlayerAnswer = PlayerAnswer.createInstance(
//       activeGame.id,
//       userId,
//       currentQuestion.id,
//       isCorrect ? AnswerStatusEnum.Correct : AnswerStatusEnum.Incorrect,
//     );
//
//     const savedAnswerId: string =
//       await this.playerAnswerRepository.savePlayerAnswer(playerAnswers);
//
//     if (isCorrect) {
//       const getPlayerProgress: PlayerProgress | null =
//         await this.playerProgressRepository.getPlayerProgress(
//           activeGame.id,
//           userId,
//         );
//       if (getPlayerProgress) {
//         getPlayerProgress.incrementScore();
//         await this.playerProgressRepository.savePlayerProgress(
//           getPlayerProgress,
//         );
//       }
//     }
//
//     const userAnswersCount: number = getAllAnswers.length + 1;
//     const questionsCount: number = questions.length;
//
//     if (userAnswersCount === questionsCount) {
//       const opponentId: string =
//         activeGame.firstPlayerId === userId
//           ? activeGame.secondPlayerId!
//           : activeGame.firstPlayerId;
//
//       const opponentAnswersCount: number =
//         await this.playerAnswerRepository.getCountByGameAndUser(
//           activeGame.id,
//           opponentId,
//         );
//
//       if (opponentAnswersCount === questionsCount) {
//         await this.pairGameService.finishGameAndAssignBonus(activeGame);
//       }
//     }
//
//     return savedAnswerId;
//   }
// }
