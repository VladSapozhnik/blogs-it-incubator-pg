import { LikeStatusEnum } from '../enums/like-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity({ name: 'comment_likes' })
@Unique(['userId', 'commentId'])
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.commentLikes)
  user: User;
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => Comment, (c) => c.commentLikes)
  comment: Comment;
  @Column({ type: 'uuid' })
  commentId: string;
  @Column({ type: 'varchar', enum: LikeStatusEnum })
  status: LikeStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;
}
