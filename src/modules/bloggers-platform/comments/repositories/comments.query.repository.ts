import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';
import { Comment } from '../entities/comment.entity';
import { sortByMapPosts } from '../../posts/dto/post-query-input.dto';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getCommentAndUserLikeStatus(
    commentId: string,
    userId: string | null,
  ): Promise<CommentWithStatusRowType> {
    const comment: CommentWithStatusRowType | undefined =
      await this.commentRepository
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
        .where('c.id = :commentId', { commentId })
        .setParameters({
          likeStatus: LikeStatusEnum.Like,
          dislikeStatus: LikeStatusEnum.Dislike,
          userId,
        })
        .getRawOne();
    // const query = `
    //     SELECT c.*, u.login AS "userLogin",
    //     (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Like')::int as "likesCount",
    //     (SELECT COUNT(*) FROM comment_likes WHERE "commentId" = c.id AND status = 'Dislike')::int as "dislikesCount",
    //     COALESCE(
    //         (SELECT status FROM comment_likes WHERE "commentId" = c.id AND "userId" = $2),
    //         'None'
    //     ) as "myStatus"
    //     FROM comments AS c
    //       INNER JOIN users AS u ON c."userId" = u.id
    //       LEFT JOIN comment_likes cl ON c."id" = cl."commentId" AND cl."userId" = $2
    //     WHERE c.id = $1;
    //   `;
    //
    // const [comment]: CommentWithStatusRowType[] = await this.dataSource.query(
    //   query,
    //   [commentId, userId],
    // );

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
