import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/posts.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { PostsQueryExternalRepository } from '../../repositories/posts.query.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';
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
  ) {}

  async execute({
    queryDto,
    userId,
    blogId,
  }: GetPostsWithLikesForBlogQuery): Promise<PaginatedViewDto<PostsMapper[]>> {
    await this.blogsExternalRepository.getBlogById(blogId);

    const { posts, totalCount } =
      await this.postsQueryExternalRepository.getPostsAndStatus(
        queryDto,
        blogId,
        userId,
      );

    const items: PostsMapper[] = posts.map(PostsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
