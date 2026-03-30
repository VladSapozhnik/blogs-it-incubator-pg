import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { SendNextAnswerDto } from './dto/send-next-answer.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectCurrentUserCommand } from './application/usecases/connect-current-user.usecase';
import { SendNextAnswerCommand } from './application/usecases/send-next-answer.usecase';
import { GetGameByIdQuery } from './application/queries/get-game-by-id.query';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { GetMyCurrentPairGameQuery } from './application/queries/get-my-current-pair-game.query';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { GetPlayerAnswerByIdQuery } from './application/queries/get-player-answer-by-id.query';
import { PlayerAnswersMapper } from './mappers/player-answers.mapper';
import { PairGameMapper } from './mappers/pair-game.mapper';
import { GetGameQuery } from './application/queries/get-game.query';
import { GetUserGameHistoryQuery } from './application/queries/get-user-game-history.query';
import { UserGameHistoryQueryInputDto } from './dto/user-game-history-query-input.dto';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class PairGamesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async connectCurrentUser(
    @User('userId') userId: string,
  ): Promise<PairGameMapper> {
    const id: string = await this.commandBus.execute<
      ConnectCurrentUserCommand,
      string
    >(new ConnectCurrentUserCommand(userId));

    return this.queryBus.execute<GetGameQuery, PairGameMapper>(
      new GetGameQuery(id),
    );
  }

  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  async sendNextAnswer(
    @Body() sendNextAnswerDto: SendNextAnswerDto,
    @User('userId') userId: string,
  ): Promise<PlayerAnswersMapper> {
    const id: string = await this.commandBus.execute<
      SendNextAnswerCommand,
      string
    >(new SendNextAnswerCommand(userId, sendNextAnswerDto.answer));

    return this.queryBus.execute<GetPlayerAnswerByIdQuery, PlayerAnswersMapper>(
      new GetPlayerAnswerByIdQuery(id),
    );
  }

  @Get('my')
  GetUserGameHistory(
    @User('userId') userId: string,
    @Query() queryDto: UserGameHistoryQueryInputDto,
  ) {
    return this.queryBus.execute<GetUserGameHistoryQuery, void>(
      new GetUserGameHistoryQuery(userId, queryDto),
    );
  }

  @Get('my-current')
  GetMyCurrentPairGame(
    @User('userId') userId: string,
  ): Promise<PairGameMapper> {
    return this.queryBus.execute<GetMyCurrentPairGameQuery, PairGameMapper>(
      new GetMyCurrentPairGameQuery(userId),
    );
  }

  @Get(':id')
  getGameById(@Param() params: WithIdDto, @User('userId') userId: string) {
    const { id } = params;
    return this.queryBus.execute<GetGameByIdQuery, PairGameMapper>(
      new GetGameByIdQuery(userId, id),
    );
  }
}
