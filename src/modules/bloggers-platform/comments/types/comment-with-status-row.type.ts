import { LikeStatusEnum } from '../../likes/enums/like-status.enum';
import { Comment } from '../entities/comment.entity';

export type CommentWithStatusRowType = Comment & {
  userLogin: string;
  myStatus: LikeStatusEnum;
  likesCount: number;
  dislikesCount: number;
};
