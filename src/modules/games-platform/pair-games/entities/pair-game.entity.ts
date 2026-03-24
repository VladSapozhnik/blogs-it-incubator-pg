import { GameStatusEnum } from '../enums/game-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';

@Entity()
export class PairGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.firstPlayers)
  firstPlayer: User;
  @Column()
  firstPlayerId: string;
  @ManyToOne(() => User, (u) => u.secondPlayers, { nullable: true })
  secondPlayer: User;
  @Column({ nullable: true })
  secondPlayerId: string | null;
  @Column({ type: 'jsonb', nullable: true })
  questions:
    | {
        id: string;
        body: string;
      }[]
    | null;
  @Column({ enum: GameStatusEnum, default: GameStatusEnum.PendingSecondPlayer })
  status: GameStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  pairCreatedDate: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date | null;
  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date | null;
  static createInstance(userId: string): PairGame {
    const pairGame = new PairGame();

    pairGame.firstPlayerId = userId;

    return pairGame;
  }

  joinPendingGame(userId: string) {
    this.secondPlayerId = userId;
    this.status = GameStatusEnum.Active;
    this.startGameDate = new Date();
  }
}
