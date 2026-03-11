import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

@Entity('comments')
@Unique(['userId', 'postId'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'varchar' })
  content: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;

  static createInstance(dto: CreateCommentDto, postId: string, userId: string) {
    const comment = new this();

    comment.postId = postId;
    comment.content = dto.content;
    comment.userId = userId;

    return comment;
  }

  updateComment(dto: UpdateCommentDto, userId: string) {
    if (this.userId !== userId) {
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

    this.content = dto.content;
  }
}
