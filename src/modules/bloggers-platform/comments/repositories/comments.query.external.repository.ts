import { Injectable } from '@nestjs/common';
import { GetCommentQueryParamsDto } from '../dto/comment-query-input.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithTotalCountType } from '../../../../core/types/with-total-count.type';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';

@Injectable()
export class CommentsQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getCommentsWithStatus(
    queryDto: GetCommentQueryParamsDto,
    postId: string,
    userId: string | null,
  ) {
    const query = `
        SELECT c.*, u.login AS "userLogin",
        (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Like')::int as "likesCount",
        (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Dislike')::int as "dislikesCount",
        COALESCE(
            (SELECT status FROM comment_likes WHERE "commentId" = c.id AND "userId" = $1),
            'None'
        ) as "myStatus",
        count(*) OVER() as total_count 
        FROM comments AS c 
          INNER JOIN users AS u ON c."userId" = u.id
          LEFT JOIN comment_likes cl ON c."id" = cl."commentId" AND cl."userId" = $1
        WHERE c."postId" = $2
        ORDER BY c."${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $3 OFFSET $4;
      `;

    const comments: WithTotalCountType<CommentWithStatusRowType>[] =
      await this.dataSource.query(query, [
        userId,
        postId,
        queryDto.pageSize,
        queryDto.calculateSkip(),
      ]);

    const totalCount: number = Number(comments[0]?.total_count || 0);

    return {
      comments,
      totalCount,
    };
  }
}
