import { Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { CoursesApiService } from "../courses/courses.service";
import { CourseModulesApiService } from "../course-modules/course-modules.service";
import { ModuleResourcesApiService } from "../module-resources/module-resources.service";
import { QuestionsApiService } from "../questions/questions.service";
import { QuestionOptionsApiService } from "../question-options/question-options.service";
import { ModulePlayerVm, QuestionWithOptionsVm } from "../../models/view-models/module-player.vm";

@Injectable({
  providedIn: "root",
})
export class CoursePlayerFacadeService {
  constructor(
    private coursesApi: CoursesApiService,
    private courseModulesApi: CourseModulesApiService,
    private moduleResourcesApi: ModuleResourcesApiService,
    private questionsApi: QuestionsApiService,
    private questionOptionsApi: QuestionOptionsApiService
  ) {}

  getCourseDetail(courseId: string) {
    return forkJoin({
      course: this.coursesApi.getById(courseId),
      modules: this.courseModulesApi.getAll(),
    }).pipe(
      map(({ course, modules }) => ({
        course,
        modules: modules
          .filter((module) => module.courseId === courseId)
          .sort((a, b) => a.orden - b.orden),
      }))
    );
  }

  getModulePlayer(courseId: string, moduleId: string): Observable<ModulePlayerVm> {
    return forkJoin({
      course: this.coursesApi.getById(courseId),
      modules: this.courseModulesApi.getAll(),
      resources: this.moduleResourcesApi.getAll(),
      questions: this.questionsApi.getAll(),
      options: this.questionOptionsApi.getAll(),
    }).pipe(
      map(({ course, modules, resources, questions, options }) => {
        const courseModules = modules
          .filter((module) => module.courseId === courseId)
          .sort((a, b) => a.orden - b.orden);
        const module = courseModules.find((item) => item.id === moduleId);

        if (!module) {
          throw new Error(`Modulo ${moduleId} no encontrado para curso ${courseId}`);
        }

        const moduleQuestions: QuestionWithOptionsVm[] = questions
          .filter((question) => question.moduleId === moduleId)
          .sort((a, b) => a.orden - b.orden)
          .map((question) => ({
            ...question,
            options: options
              .filter((option) => option.questionId === question.id)
              .sort((a, b) => a.orden - b.orden),
          }));

        const currentIndex = courseModules.findIndex((item) => item.id === moduleId);

        return {
          course,
          module,
          resources: resources
            .filter((resource) => resource.moduleId === moduleId)
            .sort((a, b) => a.orden - b.orden),
          questions: moduleQuestions,
          previousModuleId:
            currentIndex > 0 ? courseModules[currentIndex - 1].id : null,
          nextModuleId:
            currentIndex >= 0 && currentIndex < courseModules.length - 1
              ? courseModules[currentIndex + 1].id
              : null,
        };
      })
    );
  }
}
