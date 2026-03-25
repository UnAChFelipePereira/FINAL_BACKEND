import { EntityId } from "../common/id.type";

export interface ModuleAttempt {
  id: EntityId;
  enrollmentId: EntityId;
  moduleId: EntityId;
  fechaInicio: string;
  fechaTermino: string | null;
  aprobado: boolean;
  puntajeObtenido: number;
  puntajeTotal: number;
}
