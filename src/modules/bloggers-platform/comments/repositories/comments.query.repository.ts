import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getCommentAndUserLikeStatus(
    commentId: string,
    userId: string | null,
  ): Promise<CommentWithStatusRowType> {
    const query = `
        SELECT c.*, u.login AS "userLogin",
        (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Like')::int as "likesCount",
        (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Dislike')::int as "dislikesCount",
        COALESCE(
            (SELECT status FROM comment_likes WHERE "commentId" = c.id AND "userId" = $2),
            'None'
        ) as "myStatus"
        FROM comments AS c 
          INNER JOIN users AS u ON c."userId" = u.id
          LEFT JOIN comment_likes cl ON c."id" = cl."commentId" AND cl."userId" = $2
        WHERE c.id = $1;
      `;

    const [comment]: CommentWithStatusRowType[] = await this.dataSource.query(
      query,
      [commentId, userId],
    );

    if (!comment) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Comment not found',
            field: 'post',
          },
        ],
      });
    }

    return comment;
  }
}
