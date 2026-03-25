import { EntityId } from "../common/id.type";

export interface CourseModule {
  id: EntityId;
  courseId: EntityId;
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  createdAt: string;
}
