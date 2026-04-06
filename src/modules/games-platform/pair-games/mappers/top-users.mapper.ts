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

  static mapToView(result: TopUsersMapper): TopUsersMapper {
    const dto = new TopUsersMapper();

    dto.sumScore = Number(result.sumScore);
    dto.avgScores = Number(Number(result.avgScores).toFixed(2));
    dto.gamesCount = Number(result.gamesCount);
    dto.winsCount = Number(result.winsCount);
    dto.lossesCount = Number(result.lossesCount);
    dto.drawsCount = Number(result.drawsCount);

    // dto.player = {
    //   id: result.player.userId, // убедись, что в .select() алиас такой же
    //   login: result.player.userLogin, // и здесь тоже
    // };

    return dto;
  }
}
