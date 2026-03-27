import { PairGame } from '../entities/pair-game.entity';
import { PlayerAnswer } from '../entities/player-answer.entity';
import { QuizQuestion } from '../../questions/entities/quiz-question.entity';
import { QuizQuestionForGameMapper } from '../../questions/mappers/quiz-question-for-game.mapper';
import { GameStatusEnum } from '../enums/game-status.enum';
import { QuizQuestionMapper } from '../../questions/mappers/quiz-question.mapper';

export class AnswerViewDto {
  questionId: string;
  answerStatus: string;
  addedAt: string;
}

export class PlayerViewDto {
  id: string;
  login: string;
}

export class PlayerProgressViewDto {
  answers: AnswerViewDto[];
  player: PlayerViewDto;
  score: number;
}

export class PairGameMapper {
  id: string;
  firstPlayerProgress: PlayerProgressViewDto;
  secondPlayerProgress: PlayerProgressViewDto | null;
  questions: QuizQuestionForGameMapper[] | null;
  status: string;
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;

  static mapToView(
    game: PairGame,
    questions: QuizQuestion[],
    firstAnswers: PlayerAnswer[],
    secondAnswers: PlayerAnswer[],
    firstScore: number,
    secondScore: number,
    firstLogin: string,
    secondLogin: string | null,
  ): PairGameMapper {
    const dto = new PairGameMapper();

    dto.id = game.id;

    dto.firstPlayerProgress = {
      answers: firstAnswers.map((a) => ({
        questionId: a.questionId,
        answerStatus: a.answerStatus,
        addedAt: a.addedAt.toISOString(),
      })),
      player: {
        id: game.firstPlayerId,
        login: firstLogin ?? '',
      },
      score: firstScore,
    };

    dto.secondPlayerProgress = game.secondPlayerId
      ? {
          answers: secondAnswers.map((a) => ({
            questionId: a.questionId,
            answerStatus: a.answerStatus,
            addedAt: a.addedAt.toISOString(),
          })),
          player: {
            id: game.secondPlayerId,
            login: secondLogin ? secondLogin : '',
          },
          score: secondScore,
        }
      : null;

    dto.questions =
      game.status === GameStatusEnum.PendingSecondPlayer
        ? null
        : questions.map(QuizQuestionMapper.mapToView);

    dto.status = game.status;
    dto.pairCreatedDate = game.pairCreatedDate.toISOString();
    dto.startGameDate = game.startGameDate
      ? game.startGameDate.toISOString()
      : null;

    dto.finishGameDate = game.finishGameDate
      ? game.finishGameDate.toISOString()
      : null;

    return dto;
  }
}
