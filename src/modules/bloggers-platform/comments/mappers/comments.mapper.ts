import { LikeStatusEnum } from '../../likes/enums/like-status.enum';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';

export class CommentsMapper {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusEnum;
  };

  static mapToView(
    this: void,
    comment: CommentWithStatusRowType,
  ): CommentsMapper {
    const dto = new CommentsMapper();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: comment.myStatus,
    };

    return dto;
  }
}
