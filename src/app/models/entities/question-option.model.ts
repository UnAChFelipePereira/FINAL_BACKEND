import { EntityId } from "../common/id.type";

export interface QuestionOption {
  id: EntityId;
  questionId: EntityId;
  texto: string;
  esCorrecta: boolean;
  orden: number;
}
