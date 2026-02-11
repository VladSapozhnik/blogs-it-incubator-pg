import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithTotalCountType } from '../../../../core/types/with-total-count.type';
import { PostWithStatusRowType } from '../types/post-with-status-row.type';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getPostsAndStatus(
    queryDto: GetPostsQueryParamsDto,
    userId: string | null,
  ) {
    const query = `SELECT p.*, 
        b.name as "blogName",
        (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Like')::int as "likesCount",
        (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Dislike')::int as "dislikesCount",
        COALESCE(pl_user.status, 'None') as "myStatus",
        (
            SELECT COALESCE(json_agg(last_likes), '[]')
            FROM (
                  SELECT pl."createdAt" AS "addedAt",
                         pl."userId",
                         u.login
                  FROM post_likes pl
                  INNER JOIN users u ON pl."userId" = u.id
                  WHERE pl."postId" = p.id AND pl.status = 'Like'
                  ORDER BY pl."createdAt" DESC LIMIT 3
                 ) AS last_likes
        ) AS "newestLikes",
        COUNT(*) OVER() AS total_count
        FROM posts AS p 
        INNER JOIN blogs b ON p."blogId" = b.id 
        LEFT JOIN post_likes pl_user ON p.id = pl_user."postId"
        AND pl_user."userId" = $1 ORDER BY p."${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $2 OFFSET $3;`;

    const posts: WithTotalCountType<PostWithStatusRowType>[] =
      await this.dataSource.query(query, [
        userId,
        queryDto.pageSize,
        queryDto.calculateSkip(),
      ]);

    const totalCount: number =
      posts.length > 0 ? Number(posts[0].total_count) : 0;

    return {
      posts,
      totalCount,
    };
  }

  async getPostByIdWithStatus(
    id: string,
    userId: string | null,
  ): Promise<PostWithStatusRowType> {
    const query = `SELECT p.*, 
        b.name as "blogName",
        (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Like')::int as "likesCount",
        (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Dislike')::int as "dislikesCount",
        COALESCE(pl_user.status, 'None') as "myStatus",
        (
            SELECT COALESCE(json_agg(last_likes), '[]')
            FROM (
                  SELECT pl."createdAt" AS "addedAt",
                         pl."userId",
                         u.login
                  FROM post_likes pl
                  INNER JOIN users u ON pl."userId" = u.id
                  WHERE pl."postId" = p.id AND pl.status = 'Like'
                  ORDER BY pl."createdAt" DESC LIMIT 3
                 ) AS last_likes
        ) AS "newestLikes"
        FROM posts AS p 
        INNER JOIN blogs b ON p."blogId" = b.id 
        LEFT JOIN post_likes pl_user ON p.id = pl_user."postId"
        AND pl_user."userId" = $2 WHERE p.id = $1`;

    const [existPost]: PostWithStatusRowType[] = await this.dataSource.query(
      query,
      [id, userId],
    );

    if (!existPost) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Post not found',
            field: 'post',
          },
        ],
      });
    }

    return existPost;
  }
}
