import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikeTargetEnum } from '../enums/like-target.enum';

export class Like {
  userId: string;
  login: string;
  targetId: string;
  targetType: LikeTargetEnum;
  status: LikeStatusEnum;
  createdAt: Date;
  updatedAt?: Date;
}
