import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUserGameStatisticsQuery {
  constructor() {}
}

@QueryHandler(GetUserGameStatisticsQuery)
export class GetUserGameStatisticsQueryHandler implements ICommandHandler<GetUserGameStatisticsQuery> {
  async execute(query: GetUserGameStatisticsQuery) {}
}
