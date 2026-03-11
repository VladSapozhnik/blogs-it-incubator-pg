import {
  GetPostsQueryParamsDto,
  sortByMapPosts,
} from '../dto/post-query-input.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostWithStatusRowType } from '../types/post-with-status-row.type';
import { Post } from '../entities/post.entity';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

@Injectable()
export class PostsQueryExternalRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getPostsAndStatus(
    queryDto: GetPostsQueryParamsDto,
    blogId: string,
    userId: string | null,
  ) {
    const query = this.postRepository
      .createQueryBuilder('p')
      .innerJoin('p.blog', 'b')
      .leftJoin(
        'post_likes',
        'pl_user',
        'p.id = pl_user."postId" AND pl_user."userId" = :userId',
        { userId },
      )
      .select('p.*')
      .addSelect(`COALESCE(pl_user.status, 'None')`, 'myStatus')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)::INT', 'likesCount')
          .from('post_likes', 'pl')
          .where('pl."postId" = p.id')
          .andWhere('pl.status = :likeStatus', {
            likeStatus: LikeStatusEnum.Like,
          });
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)::INT', 'dislikesCount')
          .from('post_likes', 'pl')
          .where('pl."postId" = p.id')
          .andWhere('pl.status = :likeStatus', {
            likeStatus: LikeStatusEnum.Dislike,
          });
      }, 'dislikesCount')
      .addSelect(
        `(
              SELECT COALESCE(json_agg(last_likes), '[]')
              FROM (
                SELECT
                  pl."createdAt" AS "addedAt",
                  pl."userId",
                  u.login
                FROM post_likes pl
                INNER JOIN users u ON pl."userId" = u.id
                WHERE pl."postId" = p.id
                AND pl.status = 'Like'
                ORDER BY pl."createdAt" DESC
                LIMIT 3
              ) AS last_likes
            )`,
        'newestLikes',
      )
      .addSelect('b.name', 'blogName')
      .where('p."blogId" = :blogId', { blogId });

    const totalCount: number = await query.clone().getCount();

    const posts: PostWithStatusRowType[] = await query
      .orderBy(sortByMapPosts[queryDto.sortBy], queryDto.sortDirection)
      .limit(queryDto.pageSize)
      .offset(queryDto.calculateSkip())
      .getRawMany();

    // const query = `SELECT p.*,
    //     b.name as "blogName",
    //     COALESCE(pl_user.status, 'None') as "myStatus",
    //     (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Like')::int as "likesCount",
    //     (SELECT COUNT(*) FROM post_likes WHERE "postId" = p.id AND status = 'Dislike')::int as "dislikesCount",
    //     (
    //         SELECT COALESCE(json_agg(last_likes), '[]')
    //         FROM (
    //               SELECT pl."createdAt" AS "addedAt",
    //                      pl."userId",
    //                      u.login
    //               FROM post_likes pl
    //               INNER JOIN users u ON pl."userId" = u.id
    //               WHERE pl."postId" = p.id AND pl.status = 'Like'
    //               ORDER BY pl."createdAt" DESC LIMIT 3
    //              ) AS last_likes
    //     ) AS "newestLikes",
    //     COUNT(*) OVER() AS total_count
    //     FROM posts AS p
    //     INNER JOIN blogs b ON p."blogId" = b.id
    //     LEFT JOIN post_likes pl_user ON p.id = pl_user."postId"
    //     AND pl_user."userId" = $1 WHERE p."blogId" = $2 ORDER BY p."${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $3 OFFSET $4;`;
    //
    // const posts: WithTotalCountType<PostWithStatusRowType>[] =
    //   await this.dataSource.query(query, [
    //     userId,
    //     blogId,
    //     queryDto.pageSize,
    //     queryDto.calculateSkip(),
    //   ]);
    //
    // const totalCount: number =
    //   posts.length > 0 ? Number(posts[0].total_count) : 0;

    return {
      posts,
      totalCount,
    };
  }
}
