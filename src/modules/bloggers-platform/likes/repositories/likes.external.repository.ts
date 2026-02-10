import { LikeStatusEnum } from '../enums/like-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ) {
    const query = `
        INSERT INTO public.comment_likes("userId", "commentId", "status") 
        VALUES ($1, $2, $3) 
        ON CONFLICT("userId", "commentId")
        DO UPDATE SET "status" = $3;
    `;

    await this.dataSource.query(query, [userId, commentId, likeStatus]);
  }

  async updatePostLikeStatus(
    userId: string,
    postId: string,
    likeStatus: LikeStatusEnum,
  ) {
    const query = `
        INSERT INTO public.post_likes("userId", "postId", "status") 
        VALUES ($1, $2, $3) 
        ON CONFLICT("userId", "postId")
        DO UPDATE SET "status" = $3;
    `;

    await this.dataSource.query(query, [userId, postId, likeStatus]);
  }
}
