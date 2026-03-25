import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEnrollment } from '../../course-enrollments/entities/course-enrollment.entity';
import { CourseModule } from '../../course-modules/entities/course-module.entity';
import { File } from '../../files/entities/file.entity';
import { User } from '../../users/entities/user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  nombre: string;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  duracion: number;

  @Column({
    name: 'descripcion_general',
    type: 'text',
    nullable: true,
  })
  descripcionGeneral?: string | null;

  @Column({
    name: 'icon_file_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  iconFileId?: string | null;

  @Column({
    name: 'creado_por',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  creadoPorId?: string | null;

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

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => File, (file) => file.iconCourses, { nullable: true })
  @JoinColumn({ name: 'icon_file_id' })
  iconFile?: File | null;

  @ManyToOne(() => User, (user) => user.coursesCreated, { nullable: true })
  @JoinColumn({ name: 'creado_por' })
  createdBy?: User | null;

  @OneToMany(() => CourseModule, (courseModule) => courseModule.course)
  modules: CourseModule[];

  @OneToMany(
    () => CourseEnrollment,
    (courseEnrollment) => courseEnrollment.course,
  )
  enrollments: CourseEnrollment[];
}
