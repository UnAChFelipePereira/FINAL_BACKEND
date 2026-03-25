import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ModuleResource } from '../../module-resources/entities/module-resource.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255,
  })
  originalName: string;

  @Column({
    name: 'stored_name',
    type: 'varchar',
    length: 255,
  })
  storedName: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  path: string;

  @Column({
    name: 'mime_type',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  mimeType?: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  extension?: string | null;

  @Column({
    name: 'size_bytes',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  sizeBytes?: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Course, (course) => course.iconFile)
  iconCourses: Course[];

  @OneToMany(() => ModuleResource, (moduleResource) => moduleResource.file)
  moduleResources: ModuleResource[];
}
