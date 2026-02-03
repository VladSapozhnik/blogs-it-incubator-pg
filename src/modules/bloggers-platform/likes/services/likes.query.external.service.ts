import { Injectable } from '@nestjs/common';
import { LikesQueryExternalRepository } from '../repositories/likes.query.external.repository';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Like } from '../entities/like.entity';
import {
  ExtendedLikesInfoType,
  LikeInfoForPostMapper,
} from '../mappers/like-info-for-post.mapper';

@Injectable()
export class LikesQueryExternalService {
  constructor(
    private readonly likesQueryExternalRepository: LikesQueryExternalRepository,
  ) {}

  // async likesInfoForComment(commentId: string, userId: string | null) {
  //   const { likesCount, dislikesCount } =
  //     await this.likesQueryExternalRepository.getLikesAndDislikesComment(
  //       commentId,
  //       LikeTargetEnum.Comment,
  //     );
  //
  //   let myStatus: LikeStatusEnum = LikeStatusEnum.None;
  //
  //   if (userId) {
  //     const myLike: LikeDocument | null =
  //       await this.likesQueryExternalRepository.findLike(
  //         userId,
  //         commentId,
  //         LikeTargetEnum.Comment,
  //       );
  //     myStatus = myLike ? myLike.status : LikeStatusEnum.None;
  //   }
  //
  //   return { likesCount, dislikesCount, myStatus };
  // }

  async likesInfoForPosts(
    postsId: string,
    userId: string | null,
  ): Promise<ExtendedLikesInfoType> {
    const { likesCount, dislikesCount } =
      await this.likesQueryExternalRepository.getLikesAndDislikesComment(
        postsId,
        LikeTargetEnum.Post,
      );

    let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    if (userId) {
      const myLike: Like | null =
        await this.likesQueryExternalRepository.findLike(
          userId,
          postsId,
          LikeTargetEnum.Post,
        );

      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    const newestLikes: Like[] =
      await this.likesQueryExternalRepository.findNewestLikes(
        postsId,
        LikeTargetEnum.Post,
      );

    return LikeInfoForPostMapper(
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes,
    );
  }
}
