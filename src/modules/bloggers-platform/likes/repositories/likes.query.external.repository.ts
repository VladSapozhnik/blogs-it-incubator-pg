import { LikeTargetEnum } from '../enums/like-target.enum';
import { Like } from '../entities/like.entity';
import { Injectable } from '@nestjs/common';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';

@Injectable()
export class LikesQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getLikesAndDislikesComment(
    targetId: string,
    targetType: LikeTargetEnum,
  ) {
    console.log(targetId, targetType);
    // const [likesCount, dislikesCount] = await Promise.all([
    //   this.LikeModel.countDocuments({
    //     targetId: new Types.ObjectId(targetId),
    //     targetType,
    //     status: LikeStatusEnum.Like,
    //   }),
    //   this.LikeModel.countDocuments({
    //     targetId: new Types.ObjectId(targetId),
    //     targetType,
    //     status: LikeStatusEnum.Dislike,
    //   }),
    // ]);
    const likesCount = 0;
    const dislikesCount = 0;

    return Promise.resolve({
      likesCount,
      dislikesCount,
    });
  }

  async findLike(
    userId: string,
    targetId: string,
    targetType: LikeTargetEnum,
  ): Promise<Like | null> {
    // return this.LikeModel.findOne({
    //   userId: new Types.ObjectId(userId),
    //   targetId: new Types.ObjectId(targetId),
    //   targetType,
    // });

    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE userId = $1`,
      [userId],
    );

    return {
      userId,
      login: user.login,
      targetId,
      targetType,
      status: LikeStatusEnum.None,
      createdAt: new Date(),
    };
  }

  async findNewestLikes(
    targetId: string,
    targetType: LikeTargetEnum,
    likeCounts: number = 3,
  ): Promise<[]> {
    console.log(likeCounts);
    // return this.LikeModel.find({
    //   targetId: new Types.ObjectId(targetId),
    //   targetType,
    //   status: LikeStatusEnum.Like,
    // })
    //   .sort({ createdAt: -1 })
    //   .limit(likeCounts);

    return Promise.resolve([]);
  }
}
