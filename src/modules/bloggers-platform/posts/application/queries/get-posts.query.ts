import { GetPostsQueryParamsDto } from '../../dto/post-query-input.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { ExtendedLikesInfoType } from '../../../likes/mappers/like-info-for-post.mapper';
import { PostsQueryRepository } from '../../repositories/posts.query.repository';
import { LikesQueryExternalService } from '../../../likes/application/likes.query.external.service';

export class GetPostsQuery {
  constructor(
    public readonly queryDto: GetPostsQueryParamsDto,
    public readonly userId: string | null,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async execute({
    queryDto,
    userId,
  }: GetPostsQuery): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { posts, totalCount } =
      await this.postsQueryRepository.getPosts(queryDto);

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post) => {
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
