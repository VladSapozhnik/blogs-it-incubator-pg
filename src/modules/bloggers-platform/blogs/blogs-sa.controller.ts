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
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsMapper } from '../posts/mappers/posts.mapper';
import { CreatePostForBlogDto } from '../posts/dto/create-post-for-blog.dto';
import { SuperAdminAuthGuard } from '../../user-accounts/users/guards/super-admin-auth.guard';
import { OptionalJwtAuthGuard } from '../../../core/guards/optional-jwt-auth.guard';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { BlogIdParamDto } from './dto/blog-id-param.dto';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
import { BlogIdAndPostIdParamDto } from './dto/blog-id-and-post-id-param.dto';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './application/usecases/create-blog.usecase';
import { RemoveBlogIdCommand } from './application/usecases/remove-blog-id.usecase';
import { UpdateBlogCommand } from './application/usecases/update-blog.usecase';
import { GetBlogsQuery } from './application/queries/get-blogs.query';
import { GetBlogIdQuery } from './application/queries/get-blog-id.query';
import { GetPostsWithLikesForBlogQuery } from '../posts/application/queries/get-posts-with-likes-for-blog.query';
import { GetPostByIdQuery } from '../posts/application/queries/get-post-by-id.query';
import { CreatePostForBlogCommand } from '../posts/application/usecases/create-post-for-blog.usecase';
import { UpdatePostCommand } from '../posts/application/usecases/update-post.usecase';
import { RemovePostCommand } from '../posts/application/usecases/remove-post.usecase';

@Controller('sa/blogs')
@UseGuards(SuperAdminAuthGuard, OptionalJwtAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogsMapper> {
    const id: string = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(createBlogDto),
    );

    return this.queryBus.execute<GetBlogIdQuery, BlogsMapper>(
      new GetBlogIdQuery(id),
    );
  }

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

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param() params: WithIdDto, @Body() updateBlogDto: UpdateBlogDto) {
    const { id } = params;

    return this.commandBus.execute<UpdateBlogCommand, void>(
      new UpdateBlogCommand(id, updateBlogDto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: WithIdDto) {
    const { id } = params;

    return this.commandBus.execute<RemoveBlogIdCommand, void>(
      new RemoveBlogIdCommand(id),
    );
  }

  //POSTS
  @Get(':blogId/posts')
  findAllPostByBlogId(
    @User('userId') userId: string,
    @Param() param: BlogIdParamDto,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { blogId } = param;
    return this.queryBus.execute<
      GetPostsWithLikesForBlogQuery,
      PaginatedViewDto<PostsMapper[]>
    >(new GetPostsWithLikesForBlogQuery(query, userId, blogId));
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @User('userId') userId: string,
    @Param() param: BlogIdParamDto,
    @Body() createBlogDto: CreatePostForBlogDto,
  ): Promise<PostsMapper> {
    const { blogId } = param;

    const id: string = await this.commandBus.execute<
      CreatePostForBlogCommand,
      string
    >(new CreatePostForBlogCommand(createBlogDto, blogId));

    return this.queryBus.execute<GetPostByIdQuery, PostsMapper>(
      new GetPostByIdQuery(id, userId),
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePost(
    @Param() params: BlogIdAndPostIdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { blogId, postId } = params;

    return this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(blogId, postId, updatePostDto),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(@Param() params: BlogIdAndPostIdParamDto) {
    const { blogId, postId } = params;

    return this.commandBus.execute<RemovePostCommand, void>(
      new RemovePostCommand(blogId, postId),
    );
  }
}
