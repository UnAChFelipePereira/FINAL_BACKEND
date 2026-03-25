import { EntityId } from "../common/id.type";
import { UserRole } from "../common/role.type";

export interface User {
  id: EntityId;
  email: string;
  nombre: string;
  apellido: string;
  passwordHash: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
