import { LikeStatusEnum } from '../enums/like-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post_likes')
@Unique(['userId', 'postId'])
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ type: 'varchar', enum: LikeStatusEnum })
  status: LikeStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;
}
