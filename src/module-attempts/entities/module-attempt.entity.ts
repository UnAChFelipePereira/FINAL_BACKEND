import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEnrollment } from '../../course-enrollments/entities/course-enrollment.entity';
import { CourseModule } from '../../course-modules/entities/course-module.entity';
import { UserAnswer } from '../../user-answers/entities/user-answer.entity';

@Entity('module_attempts')
export class ModuleAttempt {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'enrollment_id',
    type: 'bigint',
    unsigned: true,
  })
  enrollmentId: string;

  @Column({
    name: 'module_id',
    type: 'bigint',
    unsigned: true,
  })
  moduleId: string;

  @CreateDateColumn({
    name: 'fecha_inicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaInicio: Date;

  @Column({
    name: 'fecha_termino',
    type: 'timestamp',
    nullable: true,
  })
  fechaTermino?: Date | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  aprobado: boolean;

  @Column({
    name: 'puntaje_obtenido',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  puntajeObtenido: string;

  @Column({
    name: 'puntaje_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  puntajeTotal: string;

  @ManyToOne(
    () => CourseEnrollment,
    (courseEnrollment) => courseEnrollment.moduleAttempts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: CourseEnrollment;

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.attempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.attempt)
  userAnswers: UserAnswer[];
}
