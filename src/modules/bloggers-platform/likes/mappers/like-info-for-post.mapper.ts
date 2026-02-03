import { LikeStatusEnum } from '../enums/like-status.enum';
import { Like } from '../entities/like.entity';

export type NewestLikeViewType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  newestLikes: NewestLikeViewType[];
};

export const LikeInfoForPostMapper = (
  like: number,
  dislike: number,
  myStatus: LikeStatusEnum,
  newestLikes: Like[],
): ExtendedLikesInfoType => {
  return {
    likesCount: like,
    dislikesCount: dislike,
    myStatus,
    newestLikes: newestLikes.map(
      (like: Like): NewestLikeViewType => ({
        addedAt: like.createdAt.toISOString(),
        userId: like.userId.toString(),
        login: like.login,
      }),
    ),
  };
};
