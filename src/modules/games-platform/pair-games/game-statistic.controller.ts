import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserGameStatisticsQuery } from './application/queries/get-user-game-statistics.query';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { StatisticsMapper } from './mappers/statistics.mapper';
import { GetTopUsersQuery } from './application/queries/get-top-users.query';
import { TopUsersQueryInputDto } from './dto/top-users-query-input.dto';

@Controller('pair-game-quiz/users')
export class GameStatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-statistic')
  async getUserGameStatistics(
    @User('userId') userId: string,
  ): Promise<StatisticsMapper> {
    return this.queryBus.execute<GetUserGameStatisticsQuery, StatisticsMapper>(
      new GetUserGameStatisticsQuery(userId),
    );
  }

  @Get('top')
  async getTopUsers(@Query() queryDto: TopUsersQueryInputDto) {
    return this.queryBus.execute<GetTopUsersQuery, void>(
      new GetTopUsersQuery(queryDto),
    );
  }
}
