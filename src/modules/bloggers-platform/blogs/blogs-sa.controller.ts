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
import { BlogsService } from './application/blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsQueryExternalService } from '../posts/application/posts.query.external.service';
import { PostsMapper } from '../posts/mappers/blogs.mapper';
import { PostsExternalService } from '../posts/application/posts.external.service';
import { CreatePostForBlogDto } from '../posts/dto/create-post-for-blog.dto';
import { SuperAdminAuthGuard } from '../../user-accounts/users/guards/super-admin-auth.guard';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { BlogIdParamDto } from './dto/blog-id-param.dto';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
import { BlogIdAndPostIdParamDto } from './dto/blog-id-and-post-id-param.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';

@Controller('sa/blogs')
@UseGuards(SuperAdminAuthGuard, OptionalJwtAuthGuard)
export class BlogsSaController {
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
  findAll(
    @Query() query: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':id')
  findOne(@Param() params: WithIdDto): Promise<BlogsMapper> {
    const { id } = params;

    return this.blogsQueryRepository.getBlogById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param() params: WithIdDto, @Body() updateBlogDto: UpdateBlogDto) {
    const { id } = params;

    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: WithIdDto) {
    const { id } = params;

    return this.blogsService.removeBlogById(id);
  }

  //POSTS
  @Get(':blogId/posts')
  findAllPostByBlogId(
    @User('userId') userId: string,
    @Param() param: BlogIdParamDto,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { blogId } = param;
    return this.postsQueryExternalService.getAllPostsForBlog(
      query,
      userId,
      blogId,
    );
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @User('userId') userId: string,
    @Param() param: BlogIdParamDto,
    @Body() createBlogDto: CreatePostForBlogDto,
  ): Promise<PostsMapper> {
    const { blogId } = param;

    const id: string = await this.postsExternalService.createPostForBlog(
      createBlogDto,
      blogId,
    );

    return this.postsQueryExternalService.getPostById(id, userId);
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePost(
    @Param() params: BlogIdAndPostIdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { blogId, postId } = params;

    return this.postsExternalService.updatePost(blogId, postId, updatePostDto);
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(@Param() params: BlogIdAndPostIdParamDto) {
    const { blogId, postId } = params;
    return this.postsExternalService.removePost(blogId, postId);
  }
}
