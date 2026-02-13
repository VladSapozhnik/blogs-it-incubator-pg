import { GetCommentQueryParamsDto } from '../../dto/comment-query-input.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsMapper } from '../../mappers/comments.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { CommentsQueryExternalRepository } from '../../repositories/comments.query.external.repository';
import { PostsExternalRepository } from '../../../posts/repositories/posts.external.repository';

export class GetCommentsByPostIdQuery {
  constructor(
    public readonly queryDto: GetCommentQueryParamsDto,
    public readonly postId: string,
    public readonly userId: string | null,
  ) {}
}

@QueryHandler(GetCommentsByPostIdQuery)
export class GetCommentsByPostIdQueryHandler implements IQueryHandler<GetCommentsByPostIdQuery> {
  constructor(
    private readonly commentsQueryExternalRepository: CommentsQueryExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
  ) {}

  async execute({
    queryDto,
    postId,
    userId,
  }: GetCommentsByPostIdQuery): Promise<PaginatedViewDto<CommentsMapper[]>> {
    await this.postsExternalRepository.findPostById(postId);

    const { comments, totalCount } =
      await this.commentsQueryExternalRepository.getCommentsWithStatus(
        queryDto,
        postId,
        userId,
      );

    const items: CommentsMapper[] = comments.map(CommentsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
