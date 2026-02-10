import { LikeStatusEnum } from '../enums/like-status.enum';

export class PostLikes {
  id: string;
  userId: string;
  postId: string;
  status: LikeStatusEnum;
  createdAt: Date;
  updatedAt?: Date;
}

export class CommentLikes {
  id: string;
  userId: string;
  commentId: string;
  status: LikeStatusEnum;
  createdAt: Date;
  updatedAt?: Date;
}
