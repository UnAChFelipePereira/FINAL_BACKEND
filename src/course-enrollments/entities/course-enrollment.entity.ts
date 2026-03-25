import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnrollmentStatus } from '../../common/enums/enrollment-status.enum';
import { Course } from '../../courses/entities/course.entity';
import { ModuleAttempt } from '../../module-attempts/entities/module-attempt.entity';
import { User } from '../../users/entities/user.entity';

@Entity('course_enrollments')
@Index('uq_course_enrollments_user_course', ['userId', 'courseId'], {
  unique: true,
})
export class CourseEnrollment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'user_id',
    type: 'bigint',
    unsigned: true,
  })
  userId: string;

  @Column({
    name: 'course_id',
    type: 'bigint',
    unsigned: true,
  })
  courseId: string;

  @CreateDateColumn({
    name: 'fecha_inscripcion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaInscripcion: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.INSCRITO,
  })
  estado: EnrollmentStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: '0.00',
  })
  progreso: string;

  @ManyToOne(() => User, (user) => user.courseEnrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => ModuleAttempt, (moduleAttempt) => moduleAttempt.enrollment)
  moduleAttempts: ModuleAttempt[];
}
