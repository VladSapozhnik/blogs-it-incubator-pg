import { PairGame } from '../entities/pair-game.entity';
import { AnswerStatusEnum } from '../enums/answer-status.enum';

// Описываем под-структуры для типизации маппера
export class PlayerViewDto {
  id: string;
  login: string;
}

export class AnswerViewDto {
  questionId: string;
  answerStatus: AnswerStatusEnum;
  addedAt: string;
}

export class PlayerProgressViewDto {
  answers: AnswerViewDto[];
  player: PlayerViewDto;
  score: number;
}

export class QuestionViewDto {
  id: string;
  body: string;
}

export class PairGameViewDto {
  id: string;
  firstPlayerProgress: PlayerProgressViewDto;
  secondPlayerProgress: PlayerProgressViewDto | null;
  questions: QuestionViewDto[] | null;
  status: string;
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;

  static mapToView(pairGame: PairGame): PairGameViewDto {
    const dto = new PairGameViewDto();

    dto.id = pairGame.id.toString();

    // Маппинг первого игрока
    // dto.firstPlayerProgress = {
    //   answers:
    //     pairGame.firstPlayerAnswers?.map((a) => ({
    //       questionId: a.questionId,
    //       answerStatus: a.status,
    //       addedAt: a.addedAt.toISOString(),
    //     })) || [],
    //   player: {
    //     id: pairGame.firstPlayerId,
    //     login: pairGame.firstPlayerLogin,
    //   },
    //   score: pairGame.firstPlayerScore,
    // };
    //
    // // Маппинг второго игрока (может быть null, если игра в ожидании)
    // dto.secondPlayerProgress = pairGame.secondPlayerId
    //   ? {
    //       answers:
    //         pairGame.secondPlayerAnswers?.map((a) => ({
    //           questionId: a.questionId,
    //           answerStatus: a.status,
    //           addedAt: a.addedAt.toISOString(),
    //         })) || [],
    //       player: {
    //         id: pairGame.secondPlayerId,
    //         login: pairGame.secondPlayerLogin,
    //       },
    //       score: pairGame.secondPlayerScore,
    //     }
    //   : null;
    //
    // // Маппинг вопросов
    // dto.questions =
    //   pairGame.questions?.map((q) => ({
    //     id: q.id,
    //     body: q.body,
    //   })) || null;

    dto.status = pairGame.status;
    dto.pairCreatedDate = pairGame.pairCreatedDate.toISOString();
    dto.startGameDate = pairGame.startGameDate?.toISOString() || null;
    dto.finishGameDate = pairGame.finishGameDate?.toISOString() || null;

    return dto;
  }
}
