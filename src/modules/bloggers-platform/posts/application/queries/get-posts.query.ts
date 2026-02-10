import { GetPostsQueryParamsDto } from '../../dto/post-query-input.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/posts.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { PostsQueryRepository } from '../../repositories/posts.query.repository';

export class GetPostsQuery {
  constructor(
    public readonly queryDto: GetPostsQueryParamsDto,
    public readonly userId: string | null,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute({
    queryDto,
    userId,
  }: GetPostsQuery): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { posts, totalCount } =
      await this.postsQueryRepository.getPostsAndStatus(queryDto, userId);

    const items: PostsMapper[] = posts.map(PostsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
