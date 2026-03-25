import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModuleAttempt } from '../../module-attempts/entities/module-attempt.entity';
import { QuestionOption } from '../../question-options/entities/question-option.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'attempt_id',
    type: 'bigint',
    unsigned: true,
  })
  attemptId: string;

  @Column({
    name: 'question_id',
    type: 'bigint',
    unsigned: true,
  })
  questionId: string;

  @Column({
    name: 'selected_option_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  selectedOptionId?: string | null;

  @Column({
    name: 'answer_text',
    type: 'text',
    nullable: true,
  })
  answerText?: string | null;

  @Column({
    name: 'es_correcta',
    type: 'boolean',
    default: false,
  })
  esCorrecta: boolean;

  @CreateDateColumn({
    name: 'respondido_en',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  respondidoEn: Date;

  @ManyToOne(() => ModuleAttempt, (moduleAttempt) => moduleAttempt.userAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attempt_id' })
  attempt: ModuleAttempt;

  @ManyToOne(() => Question, (question) => question.userAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(
    () => QuestionOption,
    (questionOption) => questionOption.userAnswers,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption?: QuestionOption | null;
}
