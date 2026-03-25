import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PairGame } from './pair-game.entity';
import { QuizQuestion } from '../../questions/entities/quiz-question.entity';

@Entity()
export class GameQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PairGame, (pg) => pg.gameQuestions)
  game: PairGame;

  @Column({ type: 'uuid' })
  gameId: string;

  @ManyToOne(() => QuizQuestion, (qq) => qq.gameQuestions)
  question: QuizQuestion;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'int' })
  order: number; // порядок вопросов в игре
}
