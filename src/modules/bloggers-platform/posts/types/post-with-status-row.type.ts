import { LikeStatusEnum } from '../../likes/enums/like-status.enum';
import { Post } from '../entities/post.entity';

export type NewestLikeRow = {
  addedAt: Date;
  userId: string;
  login: string;
};

export type PostWithStatusRowType = Post & {
  blogName: string;
  myStatus: LikeStatusEnum;
  likesCount: number;
  dislikesCount: number;
  newestLikes: NewestLikeRow[];
};
