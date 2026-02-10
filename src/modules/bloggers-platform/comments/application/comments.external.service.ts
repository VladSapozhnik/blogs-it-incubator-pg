import { User } from 'src/modules/user-accounts/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UsersExternalRepository } from '../../../user-accounts/users/repositories/users.external.repository';
import { Post } from '../../posts/entities/post.entity';
import { PostsExternalRepository } from '../../posts/repositories/posts.external.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsExternalRepository } from '../repositories/comments.external.repository';

@Injectable()
export class CommentsExternalService {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly commentsExternalRepository: CommentsExternalRepository,
  ) {}

  async createComment(
    userId: string,
    postId: string,
    dto: CreateCommentDto,
  ): Promise<string> {
    const existUser: User | null =
      await this.usersExternalRepository.getUserById(userId);

    const existPost: Post =
      await this.postsExternalRepository.findPostById(postId);

    return await this.commentsExternalRepository.createComment(
      dto,
      existPost.id,
      existUser.id,
    );
  }
}
