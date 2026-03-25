import { EntityId } from "../common/id.type";
import { ResourceType } from "../common/resource-type.type";

export interface ModuleResource {
  id: EntityId;
  moduleId: EntityId;
  fileId: EntityId;
  titulo: string | null;
  descripcion: string | null;
  tipoRecurso: ResourceType;
  orden: number;
}
