import { PostWithStatusRowType } from '../types/post-with-status-row.type';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

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

export class PostsMapper {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;

  static mapToView(this: void, row: PostWithStatusRowType): PostsMapper {
    const dto = new PostsMapper();

    dto.id = row.id;
    dto.title = row.title;
    dto.shortDescription = row.shortDescription;
    dto.content = row.content;
    dto.blogId = row.blogId;
    dto.blogName = row.blogName;
    dto.createdAt = row.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
      newestLikes: [],
    };
    // dto.extendedLikesInfo = {
    //   likesCount: row.likesCount,
    //   dislikesCount: row.dislikesCount,
    //   myStatus: row.myStatus,
    //   newestLikes: row.newestLikes.map((like) => ({
    //     addedAt: new Date(like.addedAt).toISOString(),
    //     userId: like.userId,
    //     login: like.login,
    //   })),
    // };

    return dto;
  }
}
