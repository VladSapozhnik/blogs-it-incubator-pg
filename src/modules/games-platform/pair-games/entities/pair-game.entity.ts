import { GameStatusEnum } from '../enums/game-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/users/entities/user.entity';
import { PlayerAnswer } from './player-answer.entity';
import { PlayerProgress } from './player-progress.entity';
import { addSeconds } from 'date-fns/addSeconds';

@Entity('pair_games')
export class PairGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.firstPlayers)
  firstPlayer: User;
  @Column({ type: 'uuid' })
  firstPlayerId: string;
  @ManyToOne(() => User, (u) => u.secondPlayers, { nullable: true })
  secondPlayer: User;
  @Column({ type: 'uuid', nullable: true })
  secondPlayerId: string | null;
  @Column({ type: 'jsonb', default: () => "'[]'" })
  questionsIds: string[];
  @Column({
    type: 'varchar',
    enum: GameStatusEnum,
    default: GameStatusEnum.PendingSecondPlayer,
  })
  status: GameStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  pairCreatedDate: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date | null;
  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date | null;
  @OneToMany(() => PlayerAnswer, (playerAnswer) => playerAnswer.game)
  playerAnswers: PlayerAnswer[];
  @OneToMany(() => PlayerProgress, (playerProgress) => playerProgress.game)
  playerProgresses: PlayerProgress[];
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

  addQuestionsIds(questionIds: string[]) {
    this.questionsIds = questionIds;
  }

  setAnswerDeadline() {
    // ANSWER_DEADLINE_SECONDS;
    this.finishGameDate = addSeconds(new Date(), 9);
  }

  finishGame() {
    this.finishGameDate = this.finishGameDate || new Date();
    this.status = GameStatusEnum.Finished;
  }
}
