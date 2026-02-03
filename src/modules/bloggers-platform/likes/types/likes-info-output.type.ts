import { LikeStatusEnum } from '../enums/like-status.enum';

export type LikesInfoOutputType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
};
