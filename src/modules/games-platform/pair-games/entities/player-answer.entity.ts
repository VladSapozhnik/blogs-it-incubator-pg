import { AnswerStatusEnum } from '../enums/answer-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PairGame } from './pair-game.entity';
import { User } from '../../../user-accounts/users/entities/user.entity';
import { QuizQuestion } from '../../questions/entities/quiz-question.entity';

@Entity()
export class PlayerAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => PairGame, (game) => game.playerAnswers)
  game: PairGame;
  @Column({ type: 'uuid' })
  gameId: string;
  @ManyToOne(() => User, (u) => u.playerAnswers)
  player: User;
  @Column({ type: 'uuid' })
  playerId: string;
  @ManyToOne(() => QuizQuestion, (qq) => qq.correctAnswers)
  question: QuizQuestion;
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({ type: 'enum', enum: AnswerStatusEnum })
  answerStatus: AnswerStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;
}
