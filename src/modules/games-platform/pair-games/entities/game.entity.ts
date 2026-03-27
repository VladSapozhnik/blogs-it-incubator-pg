import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameStatusEnum } from '../enums/game-status.enum';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  firstPlayerId: string;
  @Column({ type: 'uuid', nullable: true })
  secondPlayerId: string | null;
  // @Column({ type: 'text', array: true })
  // questionsIds: string[];
  @Column({ enum: GameStatusEnum })
  status: GameStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  pairCreatedDate: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date | null;
  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date | null;
}
