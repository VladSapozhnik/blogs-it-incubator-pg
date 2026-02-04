import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsMapper } from './mappers/blogs.mapper';
import { PostsQueryService } from './application/posts.query.service';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
// import { GetCommentQueryParamsDto } from '../comments/dto/comment-query-input.dto';
// import { CommentsQueryExternalService } from '../comments/application/comments.query.external.service';
// import { CommentsMapper } from '../comments/mappers/comments.mapper';
// import { CommentsExternalService } from '../comments/application/comments.external.service';
// import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { LikesExternalService } from '../likes/application/likes.external.service';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';

@UseGuards(OptionalJwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postQueryService: PostsQueryService,
    // private readonly commentsQueryExternalService: CommentsQueryExternalService,
    // private readonly commentsExternalService: CommentsExternalService,
    private readonly likesExternalService: LikesExternalService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async makeStatus(
    @Param('postId') postId: string,
    @User('userId') userId: string,
    @Body() dto: UpdateLikeDto,
  ) {
    return this.likesExternalService.updatePostLikeStatus(userId, postId, dto);
  }

  @Get()
  findAll(
    @User('userId') userId: string,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.postQueryService.getPosts(query, userId);
  }

  @Get(':id')
  findOne(@User('userId') userId: string, @Param('id') id: string) {
    return this.postQueryService.getPostById(id, userId);
  }

  //COMMENTS
  // @Get(':postId/comments')
  // findCommentsForPost(
  //   @User('userId') userId: string,
  //   @Param('postId') postsId: string,
  //   @Query() query: GetCommentQueryParamsDto,
  // ): Promise<PaginatedViewDto<CommentsMapper[]>> {
  //   return this.commentsQueryExternalService.getCommentsByPostId(
  //     query,
  //     postsId,
  //     userId,
  //   );
  // }

  // @Post(':postId/comments')
  // @UseGuards(JwtAuthGuard)
  // async createCommentForPost(
  //   @Param('postId') postsId: string,
  //   @User('userId') userId: string,
  //   @Body() createCommentDto: CreateCommentDto,
  // ): Promise<CommentsMapper> {
  //   const commentId: string = await this.commentsExternalService.createComment(
  //     userId,
  //     postsId,
  //     createCommentDto,
  //   );
  //
  //   return this.commentsQueryExternalService.getCommentById(commentId, userId);
  // }
}
