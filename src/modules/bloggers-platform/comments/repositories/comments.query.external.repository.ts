import { Injectable } from '@nestjs/common';
import {
  GetCommentQueryParamsDto,
  sortByMapComment,
} from '../dto/comment-query-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';
import { Comment } from '../entities/comment.entity';
import { CommentSortFieldEnum } from '../enums/comment-sort-field.enum';

@Injectable()
export class CommentsQueryExternalRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getCommentsWithStatus(
    queryDto: GetCommentQueryParamsDto,
    postId: string,
    userId: string | null,
  ) {
    const query = this.commentRepository
      .createQueryBuilder('c')
      .innerJoin('users', 'u', 'c."userId" = u.id')
      .select('c.*')
      .addSelect('u.login', 'userLogin')
      .addSelect((qb) => {
        return qb
          .select('COUNT(*)::int')
          .from('comment_likes', 'cl')
          .where('cl."commentId" = c.id')
          .andWhere('cl.status = :likeStatus');
      }, 'likesCount')
      .addSelect((qb) => {
        return qb
          .select('COUNT(*)::int')
          .from('comment_likes', 'cl')
          .where('cl."commentId" = c.id')
          .andWhere('cl.status = :dislikeStatus');
      }, 'dislikesCount')
      .addSelect(
        `COALESCE(
        (SELECT status FROM comment_likes
         WHERE "commentId" = c.id AND "userId" = :userId),
        'None'
       )`,
        'myStatus',
      )
      .addSelect('COUNT(*) OVER()', 'total_count')
      .where('c."postId" = :postId', { postId })
      .setParameters({
        userId,
        likeStatus: 'Like',
        dislikeStatus: 'Dislike',
      });

    const totalCount: number = await query.clone().getCount();

    const comments: CommentWithStatusRowType[] = await query
      .orderBy(sortByMapComment[queryDto.sortBy], queryDto.sortDirection)
      .limit(queryDto.pageSize)
      .offset(queryDto.calculateSkip())
      .getRawMany();

    // const query = `
    //     SELECT c.*, u.login AS "userLogin",
    //     (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Like')::int as "likesCount",
    //     (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Dislike')::int as "dislikesCount",
    //     COALESCE(
    //         (SELECT status FROM comment_likes WHERE "commentId" = c.id AND "userId" = $1),
    //         'None'
    //     ) as "myStatus",
    //     count(*) OVER() as total_count
    //     FROM comments AS c
    //       INNER JOIN users AS u ON c."userId" = u.id
    //       LEFT JOIN comment_likes cl ON c."id" = cl."commentId" AND cl."userId" = $1
    //     WHERE c."postId" = $2
    //     ORDER BY c."${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $3 OFFSET $4;
    //   `;
    //
    // const comments: WithTotalCountType<CommentWithStatusRowType>[] =
    //   await this.dataSource.query(query, [
    //     userId,
    //     postId,
    //     queryDto.pageSize,
    //     queryDto.calculateSkip(),
    //   ]);
    //
    // const totalCount: number = Number(comments[0]?.total_count || 0);

    return {
      comments,
      totalCount,
    };
  }
}
