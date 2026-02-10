import { Injectable } from '@nestjs/common';
import { LikesQueryExternalRepository } from '../repositories/likes.query.external.repository';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { CommentLikes, PostLikes } from '../entities/like.entity';

@Injectable()
export class LikesQueryExternalService {
  constructor(
    private readonly likesQueryExternalRepository: LikesQueryExternalRepository,
  ) {}

  // likesInfoForComment;
  async getMyStatusLikeComment(
    commentId: string,
    userId: string | null,
  ): Promise<LikeStatusEnum> {
    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike: CommentLikes | null =
        await this.likesQueryExternalRepository.getMyStatusLikeForComment(
          commentId,
          userId,
        );
      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    return myStatus;
  }

  async getMyStatusLikePost(
    postId: string,
    userId: string | null,
  ): Promise<LikeStatusEnum> {
    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike: PostLikes | null =
        await this.likesQueryExternalRepository.getMyStatusLikeForPost(
          postId,
          userId,
        );
      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    return myStatus;
  }

  // async likesInfoForPosts(
  //   postsId: string,
  //   userId: string | null,
  // ): Promise<ExtendedLikesInfoType> {
  //   const { likesCount, dislikesCount } =
  //     await this.likesQueryExternalRepository.getLikesAndDislikesComment(
  //       postsId,
  //       LikeTargetEnum.Post,
  //     );
  //
  //   let myStatus: LikeStatusEnum = LikeStatusEnum.None;
  //   if (userId) {
  //     const myLike: Like | null =
  //       await this.likesQueryExternalRepository.findLike(
  //         userId,
  //         postsId,
  //         LikeTargetEnum.Post,
  //       );
  //
  //     myStatus = myLike ? myLike.status : LikeStatusEnum.None;
  //   }
  //
  //   const newestLikes: Like[] =
  //     await this.likesQueryExternalRepository.findNewestLikes(
  //       postsId,
  //       LikeTargetEnum.Post,
  //     );
  //
  //   return LikeInfoForPostMapper(
  //     likesCount,
  //     dislikesCount,
  //     myStatus,
  //     newestLikes,
  //   );
  // }
}
