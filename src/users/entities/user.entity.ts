import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountActivationToken } from '../../account-activation-tokens/entities/account-activation-token.entity';
import { CourseEnrollment } from '../../course-enrollments/entities/course-enrollment.entity';
import { Course } from '../../courses/entities/course.entity';
import { PasswordResetToken } from '../../password-reset-tokens/entities/password-reset-token.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity('users')
@Index('uq_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  apellido: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ESTUDIANTE,
  })
  rol: UserRole;

  @Column({
    type: 'boolean',
    default: false,
  })
  activo: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Course, (course) => course.createdBy)
  coursesCreated: Course[];

  @OneToMany(() => CourseEnrollment, (courseEnrollment) => courseEnrollment.user)
  courseEnrollments: CourseEnrollment[];

  @OneToMany(
    () => AccountActivationToken,
    (accountActivationToken) => accountActivationToken.user,
  )
  accountActivationTokens: AccountActivationToken[];

  @OneToMany(
    () => PasswordResetToken,
    (passwordResetToken) => passwordResetToken.user,
  )
  passwordResetTokens: PasswordResetToken[];
}
