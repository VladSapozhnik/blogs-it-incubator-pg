import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Comment } from '../../entities/comment.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { CommentsRepository } from '../../repositories/comments.repository';

export class RemoveCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}

@CommandHandler(RemoveCommentCommand)
export class RemoveCommentUseCase implements ICommandHandler<RemoveCommentCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({ userId, id }: RemoveCommentCommand): Promise<void> {
    const findComment: Comment =
      await this.commentsRepository.getCommentById(id);

    if (findComment.userId !== userId) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'You can delete only your own comments',
            field: 'comment',
          },
        ],
      });
    }

    await this.commentsRepository.removeComment(id, userId);
  }
}
