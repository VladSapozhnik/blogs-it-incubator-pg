import { User } from '../../../user-accounts/users/entities/user.entity';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentLikes } from '../entities/like.entity';

type IsModified = {
  isModified: boolean;
};

@Injectable()
export class LikesExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const [result]: IsModified[] = await this.dataSource.query(
      `INSERT INTO public.comment_likes("userId", "commentId", status) 
                VALUES ($1, $2, $3) ON CONFLICT("userId", "commentId")
                DO UPDATE SET status = $3 
                  RETURNING (comment_likes.status IS DISTINCT FROM EXCLUDED.status) as "isModified";`,
      [userId, commentId, likeStatus],
    );

    return result ? result.isModified : true;
  }

  async updatePostLikeStatus(
    userId: string,
    postId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const [result]: IsModified[] = await this.dataSource.query(
      `INSERT INTO public.post_likes("userId", "postId", status) 
                VALUES ($1, $2, $3) ON CONFLICT("userId", "postId")
                DO UPDATE SET status = $3 
                  RETURNING (post_likes.status IS DISTINCT FROM EXCLUDED.status) as "isModified";`,
      [userId, postId, likeStatus],
    );

    return result ? result.isModified : true;
  }

  // updatePostLikeStatus(
  //   user: User,
  //   targetId: string,
  //   targetType: LikeTargetEnum,
  //   likeStatus: LikeStatusEnum,
  // ): boolean {
  //   // const result: UpdateResult = await this.LikeModel.updateOne(
  //   //   {
  //   //     userId: new Types.ObjectId(user._id),
  //   //     login: user.login,
  //   //     targetId: new Types.ObjectId(targetId),
  //   //     targetType,
  //   //   },
  //   //   {
  //   //     status: likeStatus,
  //   //   },
  //   //   { upsert: true },
  //   // );
  //
  //   return true;
  // }
}
