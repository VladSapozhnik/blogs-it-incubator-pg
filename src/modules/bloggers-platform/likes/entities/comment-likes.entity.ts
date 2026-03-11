import { LikeStatusEnum } from '../enums/like-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comment_likes' })
@Unique(['userId', 'commentId'])
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  commentId: string;
  @Column({ type: 'varchar', enum: LikeStatusEnum })
  status: LikeStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;
}
