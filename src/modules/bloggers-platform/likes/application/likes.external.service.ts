// import { Injectable } from '@nestjs/common';
// import { UpdateLikeDto } from '../dto/update-like.dto';
// import { UsersExternalRepository } from '../../../user-accounts/users/repositories/users.external.repository';
// import { User } from '../../../user-accounts/users/entities/user.entity';
// import { LikesExternalRepository } from '../repositories/likes.external.repository';
// import { CommentsExternalRepository } from '../../comments/repositories/comments.external.repository';
// import { PostsExternalRepository } from '../../posts/repositories/posts.external.repository';
//
// @Injectable()
// export class LikesExternalService {
//   constructor(
//     private readonly usersExternalRepository: UsersExternalRepository,
//     private readonly likesExternalRepository: LikesExternalRepository,
//     private readonly commentsExternalRepository: CommentsExternalRepository,
//     private readonly postsExternalRepository: PostsExternalRepository,
//   ) {}
//
//   async updateCommentLikeStatus(
//     userId: string,
//     commentId: string,
//     dto: UpdateLikeDto,
//   ) {
//     const findUser: User =
//       await this.usersExternalRepository.getUserById(userId);
//
//     await this.commentsExternalRepository.getCommentById(commentId);
//
//     await this.likesExternalRepository.updateCommentLikeStatus(
//       findUser.id,
//       commentId,
//       dto.likeStatus,
//     );
//   }
//
//   async updatePostLikeStatus(
//     userId: string,
//     postId: string,
//     dto: UpdateLikeDto,
//   ) {
//     const findUser: User | null =
//       await this.usersExternalRepository.getUserById(userId);
//
//     await this.postsExternalRepository.findPostById(postId);
//
//     await this.likesExternalRepository.updatePostLikeStatus(
//       findUser.id,
//       postId,
//       dto.likeStatus,
//     );
//   }
// }
