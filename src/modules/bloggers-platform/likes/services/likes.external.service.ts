import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateLikeDto } from '../dto/update-like.dto';
import { UsersExternalRepository } from '../../../user-accounts/users/repositories/users.external.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { User } from '../../../user-accounts/users/entities/user.entity';
import { LikesExternalRepository } from '../repositories/likes.external.repository';
import { LikeTargetEnum } from '../enums/like-target.enum';
// import { CommentsExternalRepository } from '../../comments/repositories/comments.external.repository';
import { PostsExternalRepository } from '../../posts/repositories/posts.external.repository';

@Injectable()
export class LikesExternalService {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly likesExternalRepository: LikesExternalRepository,
    // private readonly commentsExternalRepository: CommentsExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
  ) {}

  // async updateCommentLikeStatus(
  //   userId: string,
  //   targetId: string,
  //   dto: UpdateLikeDto,
  // ) {
  //   const findUser: UserDocument | null =
  //     await this.usersExternalRepository.getUserById(userId);
  //
  //   if (!findUser) {
  //     throw new DomainException({
  //       status: HttpStatus.UNAUTHORIZED,
  //       errorsMessages: [
  //         {
  //           message: 'Unauthorized',
  //           field: 'user',
  //         },
  //       ],
  //     });
  //   }
  //
  //   await this.commentsExternalRepository.getCommentById(targetId);
  //
  //   await this.likesExternalRepository.updateLikeStatus(
  //     findUser,
  //     targetId,
  //     LikeTargetEnum.Comment,
  //     dto.likeStatus,
  //   );
  // }

  async updatePostLikeStatus(
    userId: string,
    postId: string,
    dto: UpdateLikeDto,
  ) {
    const findUser: User | null =
      await this.usersExternalRepository.getUserById(userId);

    if (!findUser) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }

    await this.postsExternalRepository.findPostById(postId);

    this.likesExternalRepository.updateLikeStatus(
      findUser,
      postId,
      LikeTargetEnum.Post,
      dto.likeStatus,
    );
  }
}
