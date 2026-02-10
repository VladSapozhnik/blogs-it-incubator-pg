import { Post } from '../entities/post.entity';
import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithTotalCountType } from '../../../../core/types/with-total-count.type';
import { PostWithStatusRowType } from '../types/post-with-status-row.type';

type PostAndTotalCount = Post & { total_count: string };

@Injectable()
export class PostsQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getPostsAndStatus(
    queryDto: GetPostsQueryParamsDto,
    blogId: string,
    userId: string | null,
  ) {
    const query = `SELECT p.*, 
        b.name as "blogName", 
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
        AND pl_user."userId" = $1 WHERE p."blogId" = $2 ORDER BY p."${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $3 OFFSET $4;`;

    const posts: WithTotalCountType<PostWithStatusRowType>[] =
      await this.dataSource.query(query, [
        userId,
        blogId,
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

  async getPosts(queryDto: GetPostsQueryParamsDto, blogId: string) {
    const posts: PostAndTotalCount[] = await this.dataSource.query(
      `SELECT *, count(*) OVER() AS total_count FROM posts WHERE "blogId" = $1 ORDER BY "${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $2 OFFSET $3;`,
      [blogId, queryDto.pageSize, queryDto.calculateSkip()],
    );

    const totalCount: number = Number(posts[0]?.total_count || 0);

    return {
      posts,
      totalCount,
    };
  }
}
