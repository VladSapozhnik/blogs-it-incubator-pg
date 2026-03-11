import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersExternalRepository } from '../../../../user-accounts/users/repositories/users.external.repository';
import { PostsExternalRepository } from '../../../posts/repositories/posts.external.repository';
import { Comment } from '../../entities/comment.entity';
import { CommentsRepository } from '../../repositories/comments.repository';

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
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute({
    userId,
    postId,
    dto,
  }: CreateCommentCommand): Promise<string> {
    await this.usersExternalRepository.getUserById(userId);

    await this.postsExternalRepository.findPostById(postId);

    const comment: Comment = Comment.createInstance(dto, postId, userId);

    return this.commentsRepository.saveComment(comment);
  }
}
