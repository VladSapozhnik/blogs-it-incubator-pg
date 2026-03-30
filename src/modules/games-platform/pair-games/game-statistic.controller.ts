import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserGameStatisticsQuery } from './application/queries/get-user-game-statistics.query';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { StatisticsMapper } from './mappers/statistics.mapper';

@Controller('pair-game-quiz/users')
@UseGuards(JwtAuthGuard)
export class GameStatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('my-statistic')
  async getUserGameStatistics(
    @User('userId') userId: string,
  ): Promise<StatisticsMapper> {
    return this.queryBus.execute<GetUserGameStatisticsQuery, StatisticsMapper>(
      new GetUserGameStatisticsQuery(userId),
    );
  }
}
