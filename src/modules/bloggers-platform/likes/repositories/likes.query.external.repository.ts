import { CommentLikes, PostLikes } from '../entities/like.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatusEnum } from '../enums/like-status.enum';

@Injectable()
export class LikesQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getMyStatusLikeForComment(
    commentId: string,
    userId: string,
  ): Promise<CommentLikes | null> {
    const [commentLike]: CommentLikes[] = await this.dataSource.query(
      `SELECT * FROM comment_likes WHERE "userId" = $1 AND "commentId" = $2`,
      [userId, commentId],
    );

    if (!commentLike.status) {
      return null;
    }

    return commentLike;
  }

  async getMyStatusLikeForPost(
    postId: string,
    userId: string,
  ): Promise<PostLikes | null> {
    const [postLike]: PostLikes[] = await this.dataSource.query(
      `SELECT * FROM post_likes WHERE "userId" = $1 AND "postId" = $2`,
      [userId, postId],
    );

    if (!postLike.status) {
      return null;
    }

    return postLike;
  }

  async findNewestLikesForComment(
    commentId: string,
    likeCounts: number = 3,
  ): Promise<CommentLikes[]> {
    return this.dataSource.query(
      `SELECT * FROM comment_likes WHERE status = $1 AND "commentId" = $2 ORDER BY "createdAt" DESC LIMIT $3`,
      [LikeStatusEnum.Like, commentId, likeCounts],
    );
  }

  async findNewestLikesForPost(
    postId: string,
    likeCounts: number = 3,
  ): Promise<CommentLikes[]> {
    return this.dataSource.query(
      `SELECT * FROM post_likes WHERE status = $1 AND "postId" = $2 ORDER BY "createdAt" DESC LIMIT $3`,
      [LikeStatusEnum.Like, postId, likeCounts],
    );
  }
}
