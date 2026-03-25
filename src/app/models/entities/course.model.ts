import { EntityId } from "../common/id.type";

export interface Course {
  id: EntityId;
  nombre: string;
  descripcionGeneral: string | null;
  iconFileId: EntityId | null;
  creadoPorId: EntityId | null;
  duracion?: number | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
