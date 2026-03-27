import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateQuizQuestionDto } from '../dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from '../dto/update-quiz-question.dto';
// import { PlayerAnswer } from '../../pair-games/entities/player-answer.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  body: string;
  @Column({ type: 'text', array: true })
  correctAnswers: string[];
  @Column({ type: 'boolean', default: false })
  published: boolean;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  // @OneToMany(() => PlayerAnswer, (playerAnswer) => playerAnswer.question)
  // playerAnswers: PlayerAnswer[];
  static createInstance(dto: CreateQuizQuestionDto) {
    const question = new QuizQuestion();

    question.body = dto.body;
    question.correctAnswers = dto.correctAnswers;

    return question;
  }

  updateQuestion(dto: UpdateQuizQuestionDto) {
    this.body = dto.body;
    this.correctAnswers = dto.correctAnswers;
  }

  updatePublished(isPublished: boolean) {
    this.published = isPublished;
  }
}
