import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';

@Entity()
export class PlayerProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.playerProgresses)
  user: User;
  @Column({ type: 'uuid' })
  playerId: string;
  @Column({ type: 'uuid' })
  gameId: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;
}
