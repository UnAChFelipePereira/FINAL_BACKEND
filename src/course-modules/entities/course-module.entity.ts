import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ModuleAttempt } from '../../module-attempts/entities/module-attempt.entity';
import { ModuleResource } from '../../module-resources/entities/module-resource.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('course_modules')
export class CourseModule {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'course_id',
    type: 'bigint',
    unsigned: true,
  })
  courseId: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  titulo: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion?: string | null;

  @Column({
    type: 'int',
  })
  orden: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  activo: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.modules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => ModuleResource, (moduleResource) => moduleResource.module)
  resources: ModuleResource[];

  @OneToMany(() => Question, (question) => question.module)
  questions: Question[];

  @OneToMany(() => ModuleAttempt, (moduleAttempt) => moduleAttempt.module)
  attempts: ModuleAttempt[];
}
