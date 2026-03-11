import { HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async getCommentById(id: string): Promise<Comment> {
    const comment: Comment | null = await this.commentRepository.findOneBy({
      id,
    });

    if (!comment) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Comment not found',
            field: 'comment',
          },
        ],
      });
    }

    return comment;
  }
  async saveComment(comment: Comment): Promise<string> {
    await this.commentRepository.save(comment);

    return comment.id;
  }
  async removeComment(id: string, userId: string): Promise<void> {
    await this.commentRepository.delete({
      id,
      userId,
    });
  }
}
