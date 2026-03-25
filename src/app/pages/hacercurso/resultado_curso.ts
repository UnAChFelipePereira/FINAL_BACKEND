import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CoursePlayerFacadeService } from "../../features/course-player/course-player-facade.service";
import { EnrollmentsApiService } from "../../features/enrollments/enrollments.service";
import { ModuleAttemptsApiService } from "../../features/module-attempts/module-attempts.service";
import { UserAnswersApiService } from "../../features/user-answers/user-answers.service";
import { CourseModule } from "../../models/entities/course-module.model";
import { ModuleAttempt } from "../../models/entities/module-attempt.model";
import { UserAnswer } from "../../models/entities/user-answer.model";
import { QuestionWithOptionsVm } from "../../models/view-models/module-player.vm";

interface QuestionResultItem {
  questionId: string;
  enunciado: string;
  puntaje: number;
  respuestaUsuario: string;
  respuestaCorrecta: string;
  esCorrecta: boolean;
}

interface ModuleResultItem {
  moduleId: string;
  titulo: string;
  puntajeObtenido: number;
  puntajeTotal: number;
  aprobado: boolean;
  questions: QuestionResultItem[];
}

@Component({
  selector: "app-resultado-curso",
  templateUrl: "./resultado_curso.html",
  styleUrls: ["./resultado_curso.css"],
})
export class ResultadoCursoPage implements OnInit {
  courseId = "";
  userId = "";
  loading = true;
  courseTitle = "";
  enrollmentProgress = 0;
  totalScore = 0;
  totalPossibleScore = 0;
  resultModules: ModuleResultItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursePlayerFacade: CoursePlayerFacadeService,
    private enrollmentsApiService: EnrollmentsApiService,
    private moduleAttemptsApiService: ModuleAttemptsApiService,
    private userAnswersApiService: UserAnswersApiService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get("id") || "";
    this.userId = localStorage.getItem("user_Id") || "";

    if (!this.courseId || !this.userId) {
      this.loading = false;
      return;
    }

    this.loadSummary();
  }

  get scorePercent(): number {
    if (!this.totalPossibleScore) {
      return 0;
    }

    return Math.round((this.totalScore / this.totalPossibleScore) * 100);
  }

  get totalQuestions(): number {
    return this.resultModules.reduce((accumulator, module) => accumulator + module.questions.length, 0);
  }

  get totalCorrectAnswers(): number {
    return this.resultModules.reduce(
      (accumulator, module) => accumulator + module.questions.filter((question) => question.esCorrecta).length,
      0
    );
  }

  goToCourses(): void {
    this.router.navigate(["/mis-cursos"]);
  }

  goToCourse(): void {
    this.router.navigate(["/curso", this.courseId]);
  }

  private loadSummary(): void {
    this.loading = true;

    forkJoin({
      detail: this.coursePlayerFacade.getCourseDetail(this.courseId),
      enrollments: this.enrollmentsApiService.getAll(),
      attempts: this.moduleAttemptsApiService.getAll(),
      answers: this.userAnswersApiService.getAll(),
    }).subscribe({
      next: ({ detail, enrollments, attempts, answers }) => {
        this.courseTitle = detail.course.nombre;

        const enrollment = enrollments.find(
          (item) => item.courseId === this.courseId && item.userId === this.userId
        );

        if (!enrollment) {
          this.loading = false;
          return;
        }

        this.enrollmentProgress = enrollment.progreso;

        const attemptsByModuleId = attempts
          .filter((attempt) => attempt.enrollmentId === enrollment.id)
          .reduce((accumulator: Record<string, ModuleAttempt>, attempt) => {
            accumulator[attempt.moduleId] = attempt;
            return accumulator;
          }, {});

        const moduleRequests = detail.modules.map((module) =>
          this.coursePlayerFacade.getModulePlayer(this.courseId, module.id)
        );

        forkJoin(moduleRequests).subscribe({
          next: (modulesData) => {
            this.resultModules = detail.modules.map((module, index) => {
              const moduleData = modulesData[index];
              const attempt = attemptsByModuleId[module.id];
              const moduleAnswers = attempt
                ? answers.filter((answer) => answer.attemptId === attempt.id)
                : [];

              const questions = moduleData.questions.map((question) =>
                this.mapQuestionResult(question, moduleAnswers)
              );

              return {
                moduleId: module.id,
                titulo: module.titulo,
                puntajeObtenido: attempt?.puntajeObtenido || 0,
                puntajeTotal: attempt?.puntajeTotal || questions.reduce((sum, question) => sum + question.puntaje, 0),
                aprobado: !!attempt?.aprobado,
                questions,
              };
            });

            this.totalScore = this.resultModules.reduce(
              (accumulator, module) => accumulator + module.puntajeObtenido,
              0
            );
            this.totalPossibleScore = this.resultModules.reduce(
              (accumulator, module) => accumulator + module.puntajeTotal,
              0
            );
            this.loading = false;
          },
          error: (error) => {
            console.error("Error al cargar el resumen por modulo:", error);
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error("Error al cargar el resumen final:", error);
        this.loading = false;
      },
    });
  }

  private mapQuestionResult(
    question: QuestionWithOptionsVm,
    answers: UserAnswer[]
  ): QuestionResultItem {
    const answer = answers.find((item) => item.questionId === question.id) || null;
    const selectedOption = question.options.find(
      (option) => option.id === answer?.selectedOptionId
    );
    const correctOption = question.options.find((option) => option.esCorrecta);

    return {
      questionId: question.id,
      enunciado: question.enunciado,
      puntaje: question.puntaje,
      respuestaUsuario: answer?.answerText || selectedOption?.texto || "Sin respuesta",
      respuestaCorrecta: question.tipoPregunta === "open_text"
        ? answer?.answerText || "Respuesta abierta"
        : correctOption?.texto || "Sin alternativa correcta",
      esCorrecta: !!answer?.esCorrecta,
    };
  }
}
