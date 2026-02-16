import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query.repository';
import { BlogsExternalRepository } from './blogs/repositories/blogs.external.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryService } from './posts/application/posts.query.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts.query.repository';
import { LikesQueryExternalRepository } from './likes/repositories/likes.query.external.repository';
import { LikesExternalRepository } from './likes/repositories/likes.external.repository';
import { PostsQueryExternalRepository } from './posts/repositories/posts.query.external.repository';
import { PostsExternalRepository } from './posts/repositories/posts.external.repository';
import { CommentsController } from './comments/comments.controller';
import { CommentsQueryRepository } from './comments/repositories/comments.query.repository';
import { CommentsQueryExternalRepository } from './comments/repositories/comments.query.external.repository';
import { CommentsExternalRepository } from './comments/repositories/comments.external.repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsSaController } from './blogs/blogs-sa.controller';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { RemoveBlogIdUseCase } from './blogs/application/usecases/remove-blog-id.usecase';
import { GetBlogsQueryHandler } from './blogs/application/queries/get-blogs.query';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog-id.query';
import { GetPostsQueryHandler } from './posts/application/queries/get-posts.query';
import { GetPostByIdQueryHandler } from './posts/application/queries/get-post-by-id.query';
import { GetPostsWithLikesForBlogQueryHandler } from './posts/application/queries/get-posts-with-likes-for-blog.query';
import { UpdateCommentLikeStatusUseCase } from './likes/application/usecases/update-comment-like-status.usecase';
import { UpdatePostLikeStatusUseCase } from './likes/application/usecases/update-post-like-status.usecase';
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comment-by-id.query';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { RemoveCommentUseCase } from './comments/application/usecases/remove-comment.usecase';
import { CommentsService } from './comments/application/comments.service';
import { GetCommentsByPostIdQueryHandler } from './comments/application/queries/get-comments-by-post-id.query';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { CreatePostForBlogUseCase } from './posts/application/usecases/create-post-for-blog.usecase';
import { RemovePostUseCase } from './posts/application/usecases/remove-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';

const useCases = [
  //blogs
  CreateBlogUseCase,
  UpdateBlogUseCase,
  RemoveBlogIdUseCase,
  GetBlogsQueryHandler,
  GetBlogByIdQueryHandler,
  //POSTS
  GetPostsQueryHandler,
  GetPostByIdQueryHandler,
  GetPostsWithLikesForBlogQueryHandler,
  CreatePostForBlogUseCase,
  RemovePostUseCase,
  UpdatePostUseCase,
  //COMMENTS
  GetCommentsByPostIdQueryHandler,
  CreateCommentUseCase,
  GetCommentByIdQueryHandler,
  UpdateCommentUseCase,
  RemoveCommentUseCase,
  //LIKES
  UpdateCommentLikeStatusUseCase,
  UpdatePostLikeStatusUseCase,
];

@Module({
  imports: [UserAccountsModule],
  controllers: [
    BlogsController,
    BlogsSaController,
    PostsController,
    CommentsController,
  ],
  providers: [
    ...useCases,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsExternalRepository,
    PostsService,
    PostsQueryService,
    PostsRepository,
    PostsExternalRepository,
    PostsQueryRepository,
    PostsQueryExternalRepository,
    LikesExternalRepository,
    LikesQueryExternalRepository,
    CommentsService,
    CommentsExternalRepository,
    CommentsRepository,
    CommentsQueryRepository,
    CommentsQueryExternalRepository,
  ],
})
export class BloggersPlatformModule {}
