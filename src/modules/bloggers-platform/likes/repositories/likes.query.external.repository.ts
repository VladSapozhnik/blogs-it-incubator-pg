import { CommentLikes, PostLikes } from '../entities/like.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
}
