import { HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { CommentsRepository } from '../repositories/comments.repository';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async updateComment(userId: string, id: string, body: UpdateCommentDto) {
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

    await this.commentsRepository.updateComment(id, userId, body);
  }

  async removeComment(userId: string, id: string) {
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
