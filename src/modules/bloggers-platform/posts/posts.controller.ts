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
import { CommentsQueryExternalService } from '../comments/application/comments.query.external.service';
import { CommentsMapper } from '../comments/mappers/comments.mapper';
import { CommentsExternalService } from '../comments/application/comments.external.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { LikesExternalService } from '../likes/application/likes.external.service';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { PostIdDto } from './dto/post-id.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetPostsQuery } from './application/queries/get-posts.query';
import { GetPostByIdQuery } from './application/queries/get-post-by-id.query';

@UseGuards(OptionalJwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commentsQueryExternalService: CommentsQueryExternalService,
    private readonly commentsExternalService: CommentsExternalService,
    private readonly likesExternalService: LikesExternalService,
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

    return this.likesExternalService.updatePostLikeStatus(userId, postId, dto);
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

    return this.commentsQueryExternalService.getCommentsByPostId(
      query,
      postId,
      userId,
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

    const commentId: string = await this.commentsExternalService.createComment(
      userId,
      postId,
      createCommentDto,
    );

    return this.commentsQueryExternalService.getCommentById(commentId, userId);
  }
}
