import { HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithId } from '../../../../core/types/id.type';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
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
  async updateComment(
    id: string,
    userId: string,
    dto: UpdateCommentDto,
  ): Promise<boolean> {
    const updateCommentId: WithId[] = await this.dataSource.query(
      `UPDATE comments SET content = $1 WHERE id = $2 AND "userId" = $3 RETURNING id`,
      [dto.content, id, userId],
    );

    return updateCommentId.length > 0;
  }
  async removeComment(id: string, userId: string): Promise<boolean> {
    const result: WithId[] = await this.dataSource.query(
      `DELETE FROM comments WHERE id = $1 AND "userId" = $2 RETURNING id`,
      [id, userId],
    );

    return result.length === 1;
  }
}
