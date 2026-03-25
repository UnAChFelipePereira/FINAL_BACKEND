import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResourceType } from '../../common/enums/resource-type.enum';
import { CourseModule } from '../../course-modules/entities/course-module.entity';
import { File } from '../../files/entities/file.entity';

@Entity('module_resources')
export class ModuleResource {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'module_id',
    type: 'bigint',
    unsigned: true,
  })
  moduleId: string;

  @Column({
    name: 'file_id',
    type: 'bigint',
    unsigned: true,
  })
  fileId: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  titulo?: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion?: string | null;

  @Column({
    name: 'tipo_recurso',
    type: 'enum',
    enum: ResourceType,
    default: ResourceType.OTRO,
  })
  tipoRecurso: ResourceType;

  @Column({
    type: 'int',
    default: 1,
  })
  orden: number;

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.resources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @ManyToOne(() => File, (file) => file.moduleResources)
  @JoinColumn({ name: 'file_id' })
  file: File;
}
