import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsMapper } from '../../mappers/comments.mapper';
import { CommentWithStatusRowType } from '../../types/comment-with-status-row.type';
import { CommentsQueryRepository } from '../../repositories/comments.query.repository';

export class GetCommentByIdQuery {
  constructor(
    public readonly commentId: string,
    public readonly userId: string | null = null,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute({
    commentId,
    userId,
  }: GetCommentByIdQuery): Promise<CommentsMapper> {
    const comment: CommentWithStatusRowType =
      await this.commentsQueryRepository.getCommentAndUserLikeStatus(
        commentId,
        userId,
      );

    return CommentsMapper.mapToView(comment);
  }
}
