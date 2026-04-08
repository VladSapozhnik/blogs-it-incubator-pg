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

@Entity('player_answers')
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
  @ManyToOne(() => QuizQuestion, (qq) => qq.playerAnswers)
  question: QuizQuestion;
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({
    type: 'simple-enum',
    enum: AnswerStatusEnum,
    enumName: 'answer_status_enum',
  })
  answerStatus: AnswerStatusEnum;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  addedAt: Date;

  static createInstance(
    gameId: string,
    playerId: string,
    questionId: string,
    answerStatus: AnswerStatusEnum,
  ): PlayerAnswer {
    const playerAnswer: PlayerAnswer = new PlayerAnswer();

    playerAnswer.gameId = gameId;
    playerAnswer.playerId = playerId;
    playerAnswer.questionId = questionId;
    playerAnswer.answerStatus = answerStatus;

    return playerAnswer;
  }
}
