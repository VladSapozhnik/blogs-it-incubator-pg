export class StatisticsMapper {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;

  static mapToView(result: StatisticsMapper): StatisticsMapper {
    const dto = new StatisticsMapper();

    dto.sumScore = Number(result.sumScore);
    dto.avgScores = Number(Number(result.avgScores).toFixed(2));
    dto.gamesCount = Number(result.gamesCount);
    dto.winsCount = Number(result.winsCount);
    dto.lossesCount = Number(result.lossesCount);
    dto.drawsCount = Number(result.drawsCount);

    return dto;
  }
}
