import { Comment } from '../entities/comment.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { WithId } from '../../../../core/types/id.type';

@Injectable()
export class CommentsExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createComment(
    dto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<string> {
    const [comment]: WithId[] = await this.dataSource.query(
      `INSERT INTO public.comments(content, "postId", "userId") VALUES ($1, $2, $3) RETURNING id`,
      [dto.content, postId, userId],
    );

    if (!comment) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Failed to create comment',
            field: 'comment',
          },
        ],
      });
    }

    return comment.id;
  }

  async getCommentById(id: string): Promise<Comment> {
    const [comment]: Comment[] = await this.dataSource.query(
      `SELECT * FROM comments WHERE id = $1`,
      [id],
    );

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
}
