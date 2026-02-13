import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsMapper } from './mappers/comments.mapper';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { CommentIdDto } from './dto/comment-id.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCommentLikeStatusCommand } from '../likes/application/usecases/update-comment-like-status.usecase';
import { GetCommentByIdQuery } from './application/queries/get-comment-by-id.query';
import { UpdateCommentCommand } from './application/usecases/update-comment.usecase';
import { RemoveCommentCommand } from './application/usecases/remove-comment.usecase';

@UseGuards(JwtAuthGuard, OptionalJwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  makeLike(
    @User('userId') userId: string,
    @Body() dto: UpdateLikeDto,
    @Param() params: CommentIdDto,
  ) {
    const { commentId } = params;

    return this.commandBus.execute<UpdateCommentLikeStatusCommand, void>(
      new UpdateCommentLikeStatusCommand(userId, commentId, dto),
    );
  }

  @Get(':id')
  @Public()
  findOne(
    @User('userId') userId: string,
    @Param() params: WithIdDto,
  ): Promise<CommentsMapper> {
    const { id } = params;

    return this.queryBus.execute<GetCommentByIdQuery, CommentsMapper>(
      new GetCommentByIdQuery(id, userId),
    );
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @User('userId') userId: string,
    @Body() updateComment: UpdateCommentDto,
    @Param() params: CommentIdDto,
  ) {
    const { commentId } = params;

    return this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(userId, commentId, updateComment),
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComment(@User('userId') userId: string, @Param() params: CommentIdDto) {
    const { commentId } = params;

    return this.commandBus.execute<RemoveCommentCommand, void>(
      new RemoveCommentCommand(userId, commentId),
    );
  }
}
