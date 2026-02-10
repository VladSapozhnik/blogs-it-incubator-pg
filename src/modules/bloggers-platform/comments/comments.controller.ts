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
import { CommentsQueryService } from './application/comments.query.service';
import { CommentsMapper } from './mappers/comments.mapper';
import { CommentsService } from './application/comments.service';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { LikesExternalService } from '../likes/application/likes.external.service';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { CommentIdDto } from './dto/comment-id.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';

@UseGuards(JwtAuthGuard, OptionalJwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryService: CommentsQueryService,
    private readonly commentsService: CommentsService,
    private readonly likesExternalService: LikesExternalService,
  ) {}

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  makeLike(
    @User('userId') userId: string,
    @Body() dto: UpdateLikeDto,
    @Param() params: CommentIdDto,
  ) {
    const { commentId } = params;

    return this.likesExternalService.updateCommentLikeStatus(
      userId,
      commentId,
      dto,
    );
  }

  @Get(':id')
  @Public()
  findOne(
    @User('userId') userId: string,
    @Param() params: WithIdDto,
  ): Promise<CommentsMapper> {
    const { id } = params;

    return this.commentsQueryService.getCommentById(id, userId);
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @User('userId') userId: string,
    @Body() updateComment: UpdateCommentDto,
    @Param() params: CommentIdDto,
  ) {
    const { commentId } = params;

    return this.commentsService.updateComment(userId, commentId, updateComment);
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComment(@User('userId') userId: string, @Param() params: CommentIdDto) {
    const { commentId } = params;
    return this.commentsService.removeComment(userId, commentId);
  }
}
