import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Comment } from '../../entities/comment.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { CommentsRepository } from '../../repositories/comments.repository';

export class UpdateCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly dto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({ userId, id, dto }: UpdateCommentCommand): Promise<void> {
    const findComment: Comment =
      await this.commentsRepository.getCommentById(id);

    if (findComment.userId !== userId) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'You can update only your own comments',
            field: 'comment',
          },
        ],
      });
    }

    await this.commentsRepository.updateComment(id, userId, dto);
  }
}
