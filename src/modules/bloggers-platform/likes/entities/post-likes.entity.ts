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
import { Post } from '../../posts/entities/post.entity';

@Entity('post_likes')
@Unique(['userId', 'postId'])
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.postLikes)
  user: User;
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => Post, (post) => post.postLikes)
  post: Post;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ type: 'varchar', enum: LikeStatusEnum })
  status: LikeStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;
}
