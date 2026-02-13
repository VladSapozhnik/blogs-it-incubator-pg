import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../../user-accounts/users/entities/user.entity';
import { Post } from '../../../posts/entities/post.entity';
import { UsersExternalRepository } from '../../../../user-accounts/users/repositories/users.external.repository';
import { PostsExternalRepository } from '../../../posts/repositories/posts.external.repository';
import { CommentsExternalRepository } from '../../repositories/comments.external.repository';

export class CreateCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly dto: CreateCommentDto,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly commentsExternalRepository: CommentsExternalRepository,
  ) {}

  async execute({
    userId,
    postId,
    dto,
  }: CreateCommentCommand): Promise<string> {
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
