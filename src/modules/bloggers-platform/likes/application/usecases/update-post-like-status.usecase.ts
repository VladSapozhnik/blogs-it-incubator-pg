import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../dto/update-like.dto';
import { User } from '../../../../user-accounts/users/entities/user.entity';
import { UsersExternalRepository } from '../../../../user-accounts/users/repositories/users.external.repository';
import { LikesExternalRepository } from '../../repositories/likes.external.repository';
import { PostsExternalRepository } from '../../../posts/repositories/posts.external.repository';

export class UpdatePostLikeStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly dto: UpdateLikeDto,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<UpdatePostLikeStatusCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly likesExternalRepository: LikesExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
  ) {}

  async execute({
    userId,
    postId,
    dto,
  }: UpdatePostLikeStatusCommand): Promise<void> {
    const findUser: User =
      await this.usersExternalRepository.getUserById(userId);

    await this.postsExternalRepository.findPostById(postId);

    await this.likesExternalRepository.updatePostLikeStatus(
      findUser.id,
      postId,
      dto.likeStatus,
    );
  }
}
