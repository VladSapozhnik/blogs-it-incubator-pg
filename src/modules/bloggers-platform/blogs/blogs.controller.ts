import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsQueryExternalService } from '../posts/application/posts.query.external.service';
import { PostsMapper } from '../posts/mappers/blogs.mapper';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';

@Controller('blogs')
@UseGuards(OptionalJwtAuthGuard)
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryExternalService: PostsQueryExternalService,
  ) {}
  @Get()
  findAll(
    @Query() query: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':blogId/posts')
  findAllPostByBlogId(
    @User('userId') userId: string,
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.postsQueryExternalService.getAllPostsForBlog(
      query,
      userId,
      blogId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogsMapper> {
    return this.blogsQueryRepository.getBlogById(id);
  }
}
