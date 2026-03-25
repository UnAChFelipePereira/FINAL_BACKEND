import { EntityId } from "../common/id.type";
import { QuestionType } from "../common/question-type.type";

export interface Question {
  id: EntityId;
  moduleId: EntityId;
  enunciado: string;
  tipoPregunta: QuestionType;
  orden: number;
  puntaje: number;
}
