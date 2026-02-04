import { User } from '../../../user-accounts/users/entities/user.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesExternalRepository {
  constructor() {}

  updateLikeStatus(
    user: User,
    targetId: string,
    targetType: LikeTargetEnum,
    likeStatus: LikeStatusEnum,
  ): boolean {
    const info = {
      user,
      targetId,
      targetType,
      likeStatus,
    };

    // const result: UpdateResult = await this.LikeModel.updateOne(
    //   {
    //     userId: new Types.ObjectId(user._id),
    //     login: user.login,
    //     targetId: new Types.ObjectId(targetId),
    //     targetType,
    //   },
    //   {
    //     status: likeStatus,
    //   },
    //   { upsert: true },
    // );

    return true;
  }
}
