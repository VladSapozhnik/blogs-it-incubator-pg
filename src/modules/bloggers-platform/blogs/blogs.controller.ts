import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsMapper } from '../posts/mappers/posts.mapper';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { BlogIdParamDto } from './dto/blog-id-param.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from './application/queries/get-blogs.query';
import { GetBlogIdQuery } from './application/queries/get-blog-id.query';
import { GetPostsWithLikesForBlogQuery } from '../posts/application/queries/get-posts-with-likes-for-blog.query';

@Controller('blogs')
@UseGuards(OptionalJwtAuthGuard)
export class BlogsController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  findAll(
    @Query() query: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.queryBus.execute<
      GetBlogsQuery,
      PaginatedViewDto<BlogsMapper[]>
    >(new GetBlogsQuery(query));
  }

  @Get(':id')
  findOne(@Param() params: WithIdDto): Promise<BlogsMapper> {
    const { id } = params;

    return this.queryBus.execute<GetBlogIdQuery, BlogsMapper>(
      new GetBlogIdQuery(id),
    );
  }

  //POSTS
  @Get(':blogId/posts')
  findAllPostByBlogId(
    @User('userId') userId: string,
    @Param() params: BlogIdParamDto,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { blogId } = params;

    return this.queryBus.execute<
      GetPostsWithLikesForBlogQuery,
      PaginatedViewDto<PostsMapper[]>
    >(new GetPostsWithLikesForBlogQuery(query, userId, blogId));
  }
}
