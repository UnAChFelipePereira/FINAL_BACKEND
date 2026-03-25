import { EntityId } from "../common/id.type";
import { EnrollmentStatus } from "../common/enrollment-status.type";

export interface CourseEnrollment {
  id: EntityId;
  userId: EntityId;
  courseId: EntityId;
  fechaInscripcion: string;
  estado: EnrollmentStatus;
  progreso: number;
}
