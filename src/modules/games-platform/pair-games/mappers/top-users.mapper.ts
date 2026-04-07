import { TopUsersRowType } from '../types/top-users-row.type';

export class TopUsersMapper {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  player: {
    id: string;
    login: string;
  };

  static mapToView(this: void, result: TopUsersRowType): TopUsersMapper {
    const dto = new TopUsersMapper();

    dto.sumScore = Number(result.sumScore);
    dto.avgScores = Number(Number(result.avgScores).toFixed(2));
    dto.gamesCount = Number(result.gamesCount);
    dto.winsCount = Number(result.winsCount);
    dto.lossesCount = Number(result.lossesCount);
    dto.drawsCount = Number(result.drawsCount);

    dto.player = {
      id: result.userId,
      login: result.userLogin,
    };

    return dto;
  }
}
