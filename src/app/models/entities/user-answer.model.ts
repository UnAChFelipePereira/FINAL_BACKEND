import { EntityId } from "../common/id.type";

export interface UserAnswer {
  id: EntityId;
  attemptId: EntityId;
  questionId: EntityId;
  selectedOptionId: EntityId | null;
  answerText: string | null;
  esCorrecta: boolean;
  respondidoEn: string;
}
