import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { StatisticsMapper } from '../../mappers/statistics.mapper';

export class GetUserGameStatisticsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserGameStatisticsQuery)
export class GetUserGameStatisticsQueryHandler implements ICommandHandler<GetUserGameStatisticsQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
  ) {}

  async execute({
    userId,
  }: GetUserGameStatisticsQuery): Promise<StatisticsMapper> {
    return this.pairGamesQueryRepository.getUserGameStatistics(userId);
  }
}
