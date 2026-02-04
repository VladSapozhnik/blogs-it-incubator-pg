import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query.repository';
import { BlogsExternalRepository } from './blogs/repositories/blogs.external.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryService } from './posts/application/posts.query.service';
import { PostsExternalService } from './posts/application/posts.external.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts.query.repository';
import { LikesExternalService } from './likes/application/likes.external.service';
import { LikesQueryExternalService } from './likes/application/likes.query.external.service';
import { LikesQueryExternalRepository } from './likes/repositories/likes.query.external.repository';
import { LikesExternalRepository } from './likes/repositories/likes.external.repository';
import { PostsQueryExternalRepository } from './posts/repositories/posts.query.external.repository';
import { PostsExternalRepository } from './posts/repositories/posts.external.repository';
// import { CommentsController } from './comments/comments.controller';
// import { CommentsQueryService } from './comments/application/comments.query.service';
// import { CommentsQueryRepository } from './comments/repositories/comments.query.repository';
// import { Comment, CommentSchema } from './comments/entities/comment.entity';
// import { CommentsQueryExternalRepository } from './comments/repositories/comments.query.external.repository';
// import { CommentsQueryExternalService } from './comments/application/comments.query.external.service';
// import { CommentsExternalRepository } from './comments/repositories/comments.external.repository';
// import { CommentsRepository } from './comments/repositories/comments.repository';
// import { CommentsService } from './comments/application/comments.service';
// import { CommentsExternalService } from './comments/application/comments.external.service';
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
];

@Module({
  imports: [UserAccountsModule],
  controllers: [
    BlogsController,
    BlogsSaController,
    PostsController,
    //CommentsController
  ],
  providers: [
    ...useCases,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsExternalRepository,
    PostsService,
    PostsExternalService,
    PostsQueryService,
    PostsExternalService,
    PostsRepository,
    PostsExternalRepository,
    PostsQueryRepository,
    PostsQueryExternalRepository,
    LikesExternalService,
    LikesQueryExternalService,
    LikesExternalRepository,
    LikesQueryExternalRepository,
    // CommentsService,
    // CommentsExternalService,
    // CommentsQueryService,
    // CommentsExternalRepository,
    // CommentsRepository,
    // CommentsQueryExternalService,
    // CommentsQueryRepository,
    // CommentsQueryExternalRepository,
  ],
})
export class BloggersPlatformModule {}
