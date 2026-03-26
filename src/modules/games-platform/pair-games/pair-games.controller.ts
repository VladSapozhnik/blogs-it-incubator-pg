import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SendNextAnswerDto } from './dto/send-next-answer.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectCurrentUserCommand } from './application/usecases/connect-current-user.usecase';
import { SendNextAnswerCommand } from './application/usecases/send-next-answer.usecase';
import { GetGameByIdQuery } from './application/queries/get-game-by-id.query';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { GetMyCurrentPairGameQuery } from './application/queries/get-my-current-pair-game.query';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { PairGame } from './entities/pair-game.entity';
import { GetPlayerAnswerByIdQuery } from './application/queries/get-player-answer-by-id.query';
import { PlayerAnswersMapper } from './mappers/player-answers.mapper';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class PairGamesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('connection')
  connectCurrentUser(@User('userId') userId: string) {
    return this.commandBus.execute<ConnectCurrentUserCommand, void>(
      new ConnectCurrentUserCommand(userId),
    );
  }

  @Post('my-current/answers')
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

  @Get(':id')
  getGameById(@Param() params: WithIdDto, @User('userId') userId: string) {
    const { id } = params;
    return this.queryBus.execute<GetGameByIdQuery, PairGame>(
      new GetGameByIdQuery(userId, id),
    );
  }

  @Get('my-current')
  GetMyCurrentPairGame(@User('userId') userId: string) {
    return this.queryBus.execute<GetMyCurrentPairGameQuery, void>(
      new GetMyCurrentPairGameQuery(userId),
    );
  }
}
