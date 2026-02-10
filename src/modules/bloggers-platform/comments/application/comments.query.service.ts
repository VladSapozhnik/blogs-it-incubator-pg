import { Injectable } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query.repository';
import { CommentsMapper } from '../mappers/comments.mapper';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';

@Injectable()
export class CommentsQueryService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getCommentById(
    commentId: string,
    userId: string | null = null,
  ): Promise<CommentsMapper> {
    const comment: CommentWithStatusRowType =
      await this.commentsQueryRepository.getCommentAndUserLikeStatus(
        commentId,
        userId,
      );

    return CommentsMapper.mapToView(comment);
  }
}
