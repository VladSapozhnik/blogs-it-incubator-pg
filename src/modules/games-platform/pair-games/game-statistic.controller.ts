import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserGameStatisticsQuery } from './application/queries/get-user-game-statistics.query';

@Controller('pair-game-quiz/users')
@UseGuards(JwtAuthGuard)
export class GameStatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('my-statistic')
  getUserGameStatistics() {
    return this.queryBus.execute<GetUserGameStatisticsQuery, void>(
      new GetUserGameStatisticsQuery(),
    );
  }
}
