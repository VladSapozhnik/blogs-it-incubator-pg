import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  HttpCode,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './services/blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsQueryExternalService } from '../posts/services/posts.query.external.service';
import { PostsMapper } from '../posts/mappers/blogs.mapper';
import { PostsExternalService } from '../posts/services/posts.external.service';
import { CreatePostForBlogDto } from '../posts/dto/create-post-for-blog.dto';
import { SuperAdminAuthGuard } from '../../user-accounts/users/guards/super-admin-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';

@Controller('blogs')
@UseGuards(SuperAdminAuthGuard, OptionalJwtAuthGuard)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsExternalService: PostsExternalService,
    private readonly postsQueryExternalService: PostsQueryExternalService,
  ) {}
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogsMapper> {
    const id: string = await this.blogsService.createBlog(createBlogDto);

    return this.blogsQueryRepository.getBlogById(id);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':blogId/posts')
  @Public()
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

  @Post(':blogId/posts')
  async createPostForBlog(
    @User('userId') userId: string,
    @Param('blogId') blogId: string,
    @Body() createBlogDto: CreatePostForBlogDto,
  ): Promise<PostsMapper> {
    const id: string = await this.postsExternalService.createPostForBlog(
      createBlogDto,
      blogId,
    );

    return this.postsQueryExternalService.getPostById(id, userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<BlogsMapper> {
    return this.blogsQueryRepository.getBlogById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogsService.removeBlogById(id);
  }
}
