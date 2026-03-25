import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';
import { PairGame } from './pair-game.entity';

@Entity('player_progresses')
export class PlayerProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.playerProgresses)
  player: User;
  @Column({ type: 'uuid' })
  playerId: string;
  @ManyToOne(() => PairGame, (pg) => pg.playerProgresses)
  game: PairGame;
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'int', default: 0 })
  score: number;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;
}
