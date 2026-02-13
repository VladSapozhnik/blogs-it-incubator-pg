import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsMapper } from './mappers/posts.mapper';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetCommentQueryParamsDto } from '../comments/dto/comment-query-input.dto';
import { CommentsMapper } from '../comments/mappers/comments.mapper';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { PostIdDto } from './dto/post-id.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPostsQuery } from './application/queries/get-posts.query';
import { GetPostByIdQuery } from './application/queries/get-post-by-id.query';
import { UpdatePostLikeStatusCommand } from '../likes/application/usecases/update-post-like-status.usecase';
import { GetCommentsByPostIdQuery } from '../comments/application/queries/get-comments-by-post-id.query';
import { GetCommentByIdQuery } from '../comments/application/queries/get-comment-by-id.query';
import { CreateCommentCommand } from '../comments/application/usecases/create-comment.usecase';

@UseGuards(OptionalJwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commendBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async makeStatus(
    @Param() params: PostIdDto,
    @User('userId') userId: string,
    @Body() dto: UpdateLikeDto,
  ) {
    const { postId } = params;

    return this.commendBus.execute<UpdatePostLikeStatusCommand, void>(
      new UpdatePostLikeStatusCommand(userId, postId, dto),
    );
  }

  @Get()
  findAll(
    @User('userId') userId: string,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.queryBus.execute<
      GetPostsQuery,
      PaginatedViewDto<PostsMapper[]>
    >(new GetPostsQuery(query, userId));
  }

  @Get(':id')
  findOne(
    @User('userId') userId: string,
    @Param() params: WithIdDto,
  ): Promise<PostsMapper> {
    const { id } = params;

    return this.queryBus.execute<GetPostByIdQuery, PostsMapper>(
      new GetPostByIdQuery(id, userId),
    );
  }

  // COMMENTS
  @Get(':postId/comments')
  findCommentsForPost(
    @User('userId') userId: string,
    @Param() params: PostIdDto,
    @Query() query: GetCommentQueryParamsDto,
  ): Promise<PaginatedViewDto<CommentsMapper[]>> {
    const { postId } = params;

    return this.queryBus.execute(
      new GetCommentsByPostIdQuery(query, postId, userId),
    );
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentForPost(
    @Param() params: PostIdDto,
    @User('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentsMapper> {
    const { postId } = params;

    const commentId: string = await this.commendBus.execute<
      CreateCommentCommand,
      string
    >(new CreateCommentCommand(userId, postId, createCommentDto));

    return this.queryBus.execute<GetCommentByIdQuery, CommentsMapper>(
      new GetCommentByIdQuery(commentId, userId),
    );
  }
}
