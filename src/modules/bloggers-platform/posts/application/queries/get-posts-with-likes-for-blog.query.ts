import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/blogs.mapper';
import { Post } from '../../entities/post.entity';
import { ExtendedLikesInfoType } from '../../../likes/mappers/like-info-for-post.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { PostsQueryExternalRepository } from '../../repositories/posts.query.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';
import { LikesQueryExternalService } from '../../../likes/application/likes.query.external.service';
import { GetPostsQueryParamsDto } from '../../dto/post-query-input.dto';

export class GetPostsWithLikesForBlogQuery {
  constructor(
    public readonly queryDto: GetPostsQueryParamsDto,
    public readonly userId: string | null,
    public readonly blogId: string,
  ) {}
}

@QueryHandler(GetPostsWithLikesForBlogQuery)
export class GetPostsWithLikesForBlogQueryHandler implements IQueryHandler<GetPostsWithLikesForBlogQuery> {
  constructor(
    private readonly postsQueryExternalRepository: PostsQueryExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async execute({
    queryDto,
    userId,
    blogId,
  }: GetPostsWithLikesForBlogQuery): Promise<PaginatedViewDto<PostsMapper[]>> {
    await this.blogsExternalRepository.getBlogById(blogId);

    const { posts, totalCount } =
      await this.postsQueryExternalRepository.getPosts(queryDto, blogId);

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post: Post): Promise<PostsMapper> => {
        const extendedLikesInfoType: ExtendedLikesInfoType =
          await this.likesQueryExternalService.likesInfoForPosts(
            post.id,
            userId,
          );

        return PostsMapper.mapToView(post, extendedLikesInfoType);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
