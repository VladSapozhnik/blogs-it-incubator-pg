import { PlayerAnswer } from '../entities/player-answer.entity';

export class PlayerAnswersMapper {
  questionId: string;
  answerStatus: string;
  addedAt: string;

  static mapToView(
    this: void,
    playerAnswer: PlayerAnswer,
  ): PlayerAnswersMapper {
    const dto = new PlayerAnswersMapper();

    dto.questionId = playerAnswer.questionId;
    dto.answerStatus = playerAnswer.answerStatus;
    dto.addedAt = playerAnswer.addedAt.toISOString();

    return dto;
  }
}
