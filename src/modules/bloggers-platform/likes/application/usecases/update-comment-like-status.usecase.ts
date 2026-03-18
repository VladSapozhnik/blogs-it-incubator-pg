import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersExternalRepository } from '../../../../user-accounts/users/repositories/users.external.repository';
import { LikesExternalRepository } from '../../repositories/likes.external.repository';
import { CommentsExternalRepository } from '../../../comments/repositories/comments.external.repository';
import { UpdateLikeDto } from '../../dto/update-like.dto';
import { User } from '../../../../user-accounts/users/entities/user.entity';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly dto: UpdateLikeDto,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly likesExternalRepository: LikesExternalRepository,
    private readonly commentsExternalRepository: CommentsExternalRepository,
  ) {}

  async execute({
    userId,
    commentId,
    dto,
  }: UpdateCommentLikeStatusCommand): Promise<void> {
    const findUser: User =
      await this.usersExternalRepository.getUserById(userId);

    console.log('findUser', findUser);

    await this.commentsExternalRepository.getCommentById(commentId);

    await this.likesExternalRepository.updateCommentLikeStatus(
      findUser.id,
      commentId,
      dto.likeStatus,
    );
  }
}
