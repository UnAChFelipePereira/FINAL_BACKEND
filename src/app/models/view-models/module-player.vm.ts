import { Course } from "../entities/course.model";
import { CourseModule } from "../entities/course-module.model";
import { ModuleResource } from "../entities/module-resource.model";
import { Question } from "../entities/question.model";
import { QuestionOption } from "../entities/question-option.model";

export interface QuestionWithOptionsVm extends Question {
  options: QuestionOption[];
}

export interface ModulePlayerVm {
  course: Course;
  module: CourseModule;
  resources: ModuleResource[];
  questions: QuestionWithOptionsVm[];
  previousModuleId: string | null;
  nextModuleId: string | null;
}
