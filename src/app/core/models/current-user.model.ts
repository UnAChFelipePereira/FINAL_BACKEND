import { EntityId } from "../../models/common/id.type";
import { UserRole } from "../../models/common/role.type";

export interface CurrentUser {
  id: EntityId;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  activo: boolean;
}
