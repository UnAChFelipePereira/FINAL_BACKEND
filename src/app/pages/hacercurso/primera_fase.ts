import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";
import { CoursePlayerFacadeService } from "../../features/course-player/course-player-facade.service";
import { EnrollmentsApiService } from "../../features/enrollments/enrollments.service";
import { FilesApiService } from "../../features/files/files.service";
import { PythonRuntimeService } from "../../features/python/python-runtime.service";
import { ModuleAttemptsApiService } from "../../features/module-attempts/module-attempts.service";
import { UserAnswersApiService } from "../../features/user-answers/user-answers.service";
import { CourseModule } from "../../models/entities/course-module.model";
import { FileEntity } from "../../models/entities/file.model";
import { ModuleAttempt } from "../../models/entities/module-attempt.model";
import { UserAnswer } from "../../models/entities/user-answer.model";
import { ModulePlayerVm, QuestionWithOptionsVm } from "../../models/view-models/module-player.vm";

interface ResourceViewModel {
  id: string;
  titulo: string;
  descripcion: string;
  tipoRecurso: string;
  file: FileEntity | null;
  resolvedUrl: string;
  embedUrl: SafeResourceUrl;
  thumbnailUrl: string;
  pythonSource: string;
}

interface CourseTimerState {
  startedAt: string | null;
  remainingSeconds: number;
  endsAt: number | null;
  activeModuleId: string | null;
}

@Component({
  selector: "app-hacer-primerafase",
  templateUrl: "./primera_fase.html",
  styleUrls: ["./primera_fase.css"],
})
export class HacerPrimerafase implements OnInit, OnDestroy {
  courseId = "";
  userId = "";
  loading = true;
  saving = false;
  showError = false;
  showSuccess = false;
  alertMessage = "";

  courseTitle = "";
  modules: CourseModule[] = [];
  currentModuleIndex = 0;
  currentModuleData: ModulePlayerVm | null = null;
  currentResources: ResourceViewModel[] = [];
  enrollmentId = "";
  enrollmentProgress = 0;
  completedModuleIds = new Set<string>();
  attemptsByModuleId: Record<string, ModuleAttempt> = {};
  answersByAttemptId: Record<string, UserAnswer[]> = {};
  activeVideoResourceId = "";
  pythonSourceByResourceId: Record<string, string> = {};
  pythonOutputByResourceId: Record<string, string> = {};
  pythonRunningByResourceId: Record<string, boolean> = {};
  pendingPythonPromptsByResourceId: Record<string, string[]> = {};
  pendingPythonInputsByResourceId: Record<string, string[]> = {};
  activePythonPromptResourceId = '';

  selectedOptionAnswers: Record<string, string> = {};
  textAnswers: Record<string, string> = {};

  moduleTimeLimitMinutes = 0;
  remainingSeconds = 0;
  moduleStarted = false;
  moduleExpired = false;
  courseStartedAt: string | null = null;
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
  private countdownEndsAt: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private coursePlayerFacade: CoursePlayerFacadeService,
    private filesApiService: FilesApiService,
    private enrollmentsApiService: EnrollmentsApiService,
    private moduleAttemptsApiService: ModuleAttemptsApiService,
    private userAnswersApiService: UserAnswersApiService,
    private pythonRuntimeService: PythonRuntimeService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get("id") || "";
    this.userId = localStorage.getItem("user_Id") || "";

    if (!this.courseId || !this.userId) {
      this.loading = false;
      this.showErrorAlert("No se encontraron los datos necesarios para cargar el curso.");
      return;
    }

    this.loadCourse();
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }

  get currentModule(): CourseModule | null {
    return this.modules[this.currentModuleIndex] || null;
  }

  get currentQuestions(): QuestionWithOptionsVm[] {
    return this.currentModuleData?.questions || [];
  }

  get canGoPrevious(): boolean {
    return this.currentModuleIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentModuleIndex < this.modules.length - 1;
  }

  get isCurrentModuleCompleted(): boolean {
    const moduleId = this.currentModule?.id;
    return !!moduleId && this.completedModuleIds.has(moduleId);
  }

  get canSubmitCurrentModule(): boolean {
    return (
      this.moduleStarted &&
      !this.moduleExpired &&
      !this.isCurrentModuleCompleted &&
      !!this.currentQuestions.length &&
      !this.saving
    );
  }

  get canStartCurrentModule(): boolean {
    return !this.saving && (!this.hasTimeLimit || this.remainingSeconds > 0);
  }

  get hasTimeLimit(): boolean {
    return this.moduleTimeLimitMinutes > 0;
  }

  get totalCurrentModuleScore(): number {
    return this.currentQuestions.reduce((total, question) => total + question.puntaje, 0);
  }

  get shouldShowModuleIntro(): boolean {
    return !this.loading && !!this.currentModuleData && !this.isCurrentModuleCompleted && !this.moduleStarted;
  }

  get isAnswerInteractionDisabled(): boolean {
    return this.isCurrentModuleCompleted || this.saving || this.moduleExpired || !this.moduleStarted;
  }

  get formattedRemainingTime(): string {
    const totalSeconds = Math.max(this.remainingSeconds, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
    }

    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  loadCourse(): void {
    this.loading = true;

    forkJoin({
      detail: this.coursePlayerFacade.getCourseDetail(this.courseId),
      enrollments: this.enrollmentsApiService.getAll(),
      attempts: this.moduleAttemptsApiService.getAll(),
      answers: this.userAnswersApiService.getAll(),
    }).subscribe({
      next: ({ detail, enrollments, attempts, answers }) => {
        this.courseTitle = detail.course.nombre;
        this.modules = detail.modules;

        const enrollment = enrollments.find(
          (item) => item.courseId === this.courseId && item.userId === this.userId
        );

        if (!enrollment) {
          this.loading = false;
          this.showErrorAlert("No existe una inscripcion activa para este curso.");
          return;
        }

        this.enrollmentId = enrollment.id;
        this.enrollmentProgress = enrollment.progreso;

        const enrollmentAttempts = attempts.filter(
          (attempt) => attempt.enrollmentId === enrollment.id
        );

        this.attemptsByModuleId = enrollmentAttempts.reduce(
          (accumulator: Record<string, ModuleAttempt>, attempt) => {
            accumulator[attempt.moduleId] = attempt;
            return accumulator;
          },
          {}
        );

        this.answersByAttemptId = enrollmentAttempts.reduce(
          (accumulator: Record<string, UserAnswer[]>, attempt) => {
            accumulator[attempt.id] = answers.filter((answer) => answer.attemptId === attempt.id);
            return accumulator;
          },
          {}
        );

        this.completedModuleIds = new Set(
          enrollmentAttempts
            .filter((attempt) => !!attempt.fechaTermino)
            .map((attempt) => attempt.moduleId)
        );

        const firstPendingIndex = this.modules.findIndex(
          (module) => !this.completedModuleIds.has(module.id)
        );

        this.currentModuleIndex = firstPendingIndex >= 0 ? firstPendingIndex : 0;
        this.loadCurrentModule();
      },
      error: (error) => {
        console.error("Error al cargar el curso:", error);
        this.loading = false;
        this.showErrorAlert("No fue posible cargar el curso seleccionado.");
      },
    });
  }

  loadCurrentModule(): void {
    const module = this.currentModule;

    this.clearCountdownInterval();
    this.moduleStarted = false;
    this.moduleExpired = false;

    if (!module) {
      this.loading = false;
      this.currentModuleData = null;
      this.currentResources = [];
      this.remainingSeconds = 0;
      this.moduleTimeLimitMinutes = 0;
      return;
    }

    this.loading = true;
    this.resetAnswerDraft();
    this.activeVideoResourceId = "";

    this.coursePlayerFacade.getModulePlayer(this.courseId, module.id).subscribe({
      next: (moduleData) => {
        this.currentModuleData = moduleData;
        this.applyStoredAnswersForCurrentModule();
        this.setupCourseTimer();
        this.loadResourceFiles(moduleData);
      },
      error: (error) => {
        console.error("Error al cargar el modulo:", error);
        this.loading = false;
        this.showErrorAlert("No fue posible cargar el modulo actual.");
      },
    });
  }

  loadResourceFiles(moduleData: ModulePlayerVm): void {
    this.filesApiService.getAll().subscribe({
      next: (files) => {
        this.currentResources = moduleData.resources.map((resource) => {
          const file = files.find((item) => item.id === resource.fileId) || null;
          const resolvedUrl = this.resolveResourceUrlFromPath(file?.path || "");
          const pythonSource = this.extractInlinePythonSource(file?.path || "");

          return {
            id: resource.id,
            titulo: resource.titulo || "Recurso del modulo",
            descripcion: resource.descripcion || "",
            tipoRecurso: resource.tipoRecurso,
            file,
            resolvedUrl,
            embedUrl: this.buildYoutubeEmbedUrl(resolvedUrl),
            thumbnailUrl: this.buildYoutubeThumbnailUrl(resolvedUrl),
            pythonSource,
          };
        });
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar archivos del modulo:", error);
        this.currentResources = moduleData.resources.map((resource) => ({
          id: resource.id,
          titulo: resource.titulo || "Recurso del modulo",
          descripcion: resource.descripcion || "",
          tipoRecurso: resource.tipoRecurso,
          file: null,
          resolvedUrl: "",
          embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(""),
          thumbnailUrl: "",
          pythonSource: "",
        }));
        this.loading = false;
      },
    });
  }

  goToModule(index: number): void {
    if (index < 0 || index >= this.modules.length) {
      return;
    }

    if (index !== this.currentModuleIndex && !this.isCurrentModuleCompleted) {
      this.showErrorAlert("Debes enviar las respuestas del modulo actual antes de cambiar de modulo.");
      return;
    }

    if (!this.isModuleUnlocked(index)) {
      this.showErrorAlert("Debes enviar las respuestas del modulo actual antes de avanzar.");
      return;
    }

    this.currentModuleIndex = index;
    this.hideAlerts();
    this.loadCurrentModule();
  }

  previousModule(): void {
    if (this.canGoPrevious) {
      this.goToModule(this.currentModuleIndex - 1);
    }
  }

  nextModule(): void {
    if (!this.isCurrentModuleCompleted) {
      this.showErrorAlert("Debes enviar las respuestas del modulo actual antes de continuar.");
      return;
    }

    if (this.hasTimeLimit && this.remainingSeconds <= 0) {
      this.router.navigate(["/resultado_curso", this.courseId]);
      return;
    }

    if (this.canGoNext) {
      this.goToModule(this.currentModuleIndex + 1);
      return;
    }

    this.router.navigate(["/resultado_curso", this.courseId]);
  }

  startCurrentModule(): void {
    if (!this.currentModule || this.isCurrentModuleCompleted || this.moduleStarted || !this.canStartCurrentModule) {
      return;
    }

    this.hideAlerts();
    this.moduleStarted = true;
    this.moduleExpired = false;

    if (!this.courseStartedAt) {
      this.courseStartedAt = new Date().toISOString();
    }

    if (!this.hasTimeLimit) {
      this.persistCourseTimerState({
        startedAt: this.courseStartedAt,
        remainingSeconds: this.remainingSeconds,
        endsAt: null,
        activeModuleId: null,
      });
      return;
    }

    const endsAt = Date.now() + this.remainingSeconds * 1000;
    this.persistCourseTimerState({
      startedAt: this.courseStartedAt,
      remainingSeconds: this.remainingSeconds,
      endsAt,
      activeModuleId: this.currentModule.id,
    });
    this.startCountdown(endsAt);
  }

  submitCurrentModule(forceSubmit = false): void {
    if (!this.currentModuleData || !this.currentModule || this.isCurrentModuleCompleted || this.saving) {
      return;
    }

    if (!forceSubmit) {
      const validationError = this.validateAnswers();
      if (validationError) {
        this.showErrorAlert(validationError);
        return;
      }
    }

    this.saving = true;

    const evaluation = this.buildEvaluation();
    const now = new Date().toISOString();

    this.moduleAttemptsApiService
      .create({
        enrollmentId: this.enrollmentId,
        moduleId: this.currentModule.id,
        fechaInicio: this.courseStartedAt || now,
        fechaTermino: now,
        aprobado: evaluation.puntajeObtenido === evaluation.puntajeTotal,
        puntajeObtenido: evaluation.puntajeObtenido,
        puntajeTotal: evaluation.puntajeTotal,
      })
      .subscribe({
        next: (attempt) => {
          const answerRequests = evaluation.answers.map((answer) =>
            this.userAnswersApiService.create({
              attemptId: attempt.id,
              questionId: answer.questionId,
              selectedOptionId: answer.selectedOptionId,
              answerText: answer.answerText,
              esCorrecta: answer.esCorrecta,
              respondidoEn: now,
            })
          );

          forkJoin(answerRequests).subscribe({
            next: (savedAnswers) => {
              this.pauseCourseTimer();
              this.completedModuleIds.add(this.currentModule!.id);
              this.attemptsByModuleId[this.currentModule!.id] = attempt;
              this.answersByAttemptId[attempt.id] = savedAnswers;
              this.applyStoredAnswersForCurrentModule();
              this.updateEnrollmentProgress(forceSubmit);
            },
            error: (error) => {
              console.error("Error al guardar respuestas:", error);
              this.saving = false;
              this.showErrorAlert("No fue posible guardar las respuestas del modulo.");
            },
          });
        },
        error: (error) => {
          console.error("Error al crear intento del modulo:", error);
          this.saving = false;
          this.showErrorAlert("No fue posible registrar el intento del modulo.");
        },
      });
  }

  getQuestionAnswer(question: QuestionWithOptionsVm): string {
    if (question.tipoPregunta === "open_text") {
      return this.textAnswers[question.id] || "";
    }

    return this.selectedOptionAnswers[question.id] || "";
  }

  getQuestionResultLabel(question: QuestionWithOptionsVm): string {
    if (!this.isCurrentModuleCompleted) {
      return "";
    }

    return this.isQuestionCorrect(question) ? "Correcta" : "Incorrecta";
  }

  isQuestionCorrect(question: QuestionWithOptionsVm): boolean {
    return !!this.getStoredAnswer(question.id)?.esCorrecta;
  }

  getQuestionStateClass(question: QuestionWithOptionsVm): string {
    if (!this.isCurrentModuleCompleted) {
      return "";
    }

    return this.isQuestionCorrect(question) ? "question-card--correct" : "question-card--incorrect";
  }

  getOptionStateClass(question: QuestionWithOptionsVm, optionId: string, optionIsCorrect: boolean): string {
    if (!this.isCurrentModuleCompleted) {
      return "";
    }

    const answer = this.getStoredAnswer(question.id);
    if (!answer) {
      return "";
    }

    if (optionIsCorrect) {
      return "option-item--correct";
    }

    if (answer.selectedOptionId === optionId && !answer.esCorrecta) {
      return "option-item--incorrect";
    }

    return "";
  }

  getOpenTextStateClass(question: QuestionWithOptionsVm): string {
    if (!this.isCurrentModuleCompleted) {
      return "";
    }

    return this.isQuestionCorrect(question) ? "text-answer--correct" : "text-answer--incorrect";
  }

  getStoredAnswer(questionId: string): UserAnswer | null {
    const attempt = this.currentModule ? this.attemptsByModuleId[this.currentModule.id] : null;
    const answers = attempt ? this.answersByAttemptId[attempt.id] || [] : [];
    return answers.find((answer) => answer.questionId === questionId) || null;
  }

  getResourceUrl(resource: ResourceViewModel): string {
    return resource.resolvedUrl;
  }

  getYoutubeEmbedUrl(resource: ResourceViewModel): SafeResourceUrl {
    return resource.embedUrl;
  }

  getYoutubeThumbnailUrl(resource: ResourceViewModel): string {
    return resource.thumbnailUrl;
  }

  isImageResource(resource: ResourceViewModel): boolean {
    return resource.tipoRecurso === "imagen";
  }

  isVideoResource(resource: ResourceViewModel): boolean {
    return resource.tipoRecurso === "video";
  }

  isPythonResource(resource: ResourceViewModel): boolean {
    return resource.tipoRecurso === "python";
  }

  downloadLabel(resource: ResourceViewModel): string {
    return resource.file?.originalName || resource.titulo;
  }

  isVideoPlaying(resource: ResourceViewModel): boolean {
    return this.activeVideoResourceId === resource.id;
  }

  playVideo(resource: ResourceViewModel): void {
    this.activeVideoResourceId = resource.id;
  }

  getPythonCode(resource: ResourceViewModel): string {
    if (!this.pythonSourceByResourceId[resource.id]) {
      this.pythonSourceByResourceId[resource.id] = resource.pythonSource || "print('Hola desde Python')";
    }

    return this.pythonSourceByResourceId[resource.id];
  }

  updatePythonCode(resource: ResourceViewModel, value: string): void {
    this.pythonSourceByResourceId[resource.id] = value;
  }

  getPythonOutput(resource: ResourceViewModel): string {
    return this.pythonOutputByResourceId[resource.id] || "> Programa listo para ejecutar";
  }

  isPythonRunning(resource: ResourceViewModel): boolean {
    return !!this.pythonRunningByResourceId[resource.id];
  }

  async runPythonResource(resource: ResourceViewModel): Promise<void> {
    const code = this.getPythonCode(resource);
    const prompts = this.pythonRuntimeService.extractInputPrompts(code);

    if (prompts.length) {
      this.activePythonPromptResourceId = resource.id;
      this.pendingPythonPromptsByResourceId[resource.id] = prompts;
      this.pendingPythonInputsByResourceId[resource.id] = prompts.map(() => "");
      this.pythonOutputByResourceId[resource.id] = "> Completa los datos solicitados para ejecutar el programa";
      return;
    }

    await this.executePythonResource(resource, []);
  }

  updatePythonPromptValue(resource: ResourceViewModel, promptIndex: number, value: string): void {
    if (!this.pendingPythonInputsByResourceId[resource.id]) {
      this.pendingPythonInputsByResourceId[resource.id] = [];
    }

    this.pendingPythonInputsByResourceId[resource.id][promptIndex] = value;
  }

  getPythonPrompts(resource: ResourceViewModel): string[] {
    return this.pendingPythonPromptsByResourceId[resource.id] || [];
  }

  getPythonPromptValue(resource: ResourceViewModel, promptIndex: number): string {
    return this.pendingPythonInputsByResourceId[resource.id]?.[promptIndex] || "";
  }

  hasPendingPythonPrompts(resource: ResourceViewModel): boolean {
    return this.activePythonPromptResourceId === resource.id && this.getPythonPrompts(resource).length > 0;
  }

  cancelPythonPrompts(resource: ResourceViewModel): void {
    delete this.pendingPythonPromptsByResourceId[resource.id];
    delete this.pendingPythonInputsByResourceId[resource.id];
    this.activePythonPromptResourceId = "";
    this.pythonOutputByResourceId[resource.id] = "> Ejecucion cancelada";
  }

  async confirmPythonPrompts(resource: ResourceViewModel): Promise<void> {
    const inputs = [...(this.pendingPythonInputsByResourceId[resource.id] || [])];
    delete this.pendingPythonPromptsByResourceId[resource.id];
    delete this.pendingPythonInputsByResourceId[resource.id];
    this.activePythonPromptResourceId = "";
    await this.executePythonResource(resource, inputs);
  }

  resetPythonResource(resource: ResourceViewModel): void {
    this.pythonSourceByResourceId[resource.id] = resource.pythonSource || "print('Hola desde Python')";
    delete this.pendingPythonPromptsByResourceId[resource.id];
    delete this.pendingPythonInputsByResourceId[resource.id];
    this.activePythonPromptResourceId = "";
    this.pythonOutputByResourceId[resource.id] = "> Programa reiniciado";
  }

  private async executePythonResource(resource: ResourceViewModel, inputs: string[]): Promise<void> {
    const code = this.getPythonCode(resource);

    this.pythonRunningByResourceId[resource.id] = true;
    this.pythonOutputByResourceId[resource.id] = "> Ejecutando...";

    try {
      const output = await this.pythonRuntimeService.run({ code, inputs });
      this.pythonOutputByResourceId[resource.id] = output;
    } catch (error) {
      this.pythonOutputByResourceId[resource.id] =
        error instanceof Error ? error.message : String(error);
    } finally {
      this.pythonRunningByResourceId[resource.id] = false;
    }
  }

  isModuleUnlocked(index: number): boolean {
    return index <= this.getHighestUnlockedIndex();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByResourceId(index: number, resource: ResourceViewModel): string {
    void index;
    return resource.id;
  }

  goBackToCourses(): void {
    this.router.navigate(["/mis-cursos"]);
  }

  private resolveResourceUrlFromPath(path: string): string {
    if (!path || path.startsWith("inline-python:")) {
      return "";
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${environment.apiUrl}${path}`;
  }

  private extractInlinePythonSource(path: string): string {
    if (!path || !path.startsWith("inline-python:")) {
      return "";
    }

    try {
      const encoded = path.replace("inline-python:", "");
      return decodeURIComponent(escape(atob(encoded)));
    } catch {
      return "print('No fue posible cargar el codigo Python.')";
    }
  }

  private buildYoutubeEmbedUrl(url: string): SafeResourceUrl {
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl("");
    }

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    const embedUrl = match
      ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1`
      : url;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private buildYoutubeThumbnailUrl(url: string): string {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : "";
  }

  private applyStoredAnswersForCurrentModule(): void {
    if (!this.currentModule) {
      return;
    }

    const attempt = this.attemptsByModuleId[this.currentModule.id];
    if (!attempt) {
      return;
    }

    const answers = this.answersByAttemptId[attempt.id] || [];

    answers.forEach((answer) => {
      if (answer.selectedOptionId) {
        this.selectedOptionAnswers[answer.questionId] = answer.selectedOptionId;
      }

      if (answer.answerText) {
        this.textAnswers[answer.questionId] = answer.answerText;
      }
    });
  }

  private getHighestUnlockedIndex(): number {
    const firstPendingIndex = this.modules.findIndex(
      (module) => !this.completedModuleIds.has(module.id)
    );

    return firstPendingIndex === -1 ? this.modules.length - 1 : firstPendingIndex;
  }

  private updateEnrollmentProgress(autoSubmitted: boolean): void {
    const progress = this.modules.length
      ? Math.round((this.completedModuleIds.size / this.modules.length) * 100)
      : 0;
    const finishedCourse = progress >= 100;

    if (finishedCourse) {
      this.clearCourseTimerState();
    }

    this.enrollmentsApiService
      .update(this.enrollmentId, {
        progreso: progress,
        estado: finishedCourse ? "completado" : "en_progreso",
      })
      .subscribe({
        next: (enrollment) => {
          this.enrollmentProgress = enrollment.progreso;
          this.saving = false;
          this.showSuccessAlert(
            finishedCourse
              ? autoSubmitted
                ? "Se acabo el tiempo y el curso se envio automaticamente."
                : "Curso completado correctamente."
              : autoSubmitted
                ? "Se acabo el tiempo y el modulo se envio automaticamente."
                : "Modulo completado correctamente."
          );

          if (finishedCourse) {
            this.router.navigate(["/resultado_curso", this.courseId]);
          }
        },
        error: (error) => {
          console.error("Error al actualizar progreso:", error);
          this.saving = false;
          this.showSuccessAlert(
            finishedCourse
              ? "Curso completado, pero no se pudo actualizar el progreso."
              : "Modulo completado, pero no se pudo actualizar el progreso."
          );

          if (finishedCourse) {
            this.router.navigate(["/resultado_curso", this.courseId]);
          }
        },
      });
  }

  private validateAnswers(): string {
    const unansweredQuestion = this.currentQuestions.find((question) => {
      if (question.tipoPregunta === "open_text") {
        return !(this.textAnswers[question.id] || "").trim();
      }

      return !this.selectedOptionAnswers[question.id];
    });

    return unansweredQuestion
      ? "Debes responder todas las preguntas antes de continuar."
      : "";
  }

  private buildEvaluation(): {
    puntajeObtenido: number;
    puntajeTotal: number;
    answers: Array<{
      questionId: string;
      selectedOptionId: string | null;
      answerText: string | null;
      esCorrecta: boolean;
    }>;
  } {
    let puntajeObtenido = 0;
    let puntajeTotal = 0;

    const answers = this.currentQuestions.map((question) => {
      puntajeTotal += question.puntaje;

      if (question.tipoPregunta === "open_text") {
        const answerText = (this.textAnswers[question.id] || "").trim();
        const esCorrecta = !!answerText;

        if (esCorrecta) {
          puntajeObtenido += question.puntaje;
        }

        return {
          questionId: question.id,
          selectedOptionId: null,
          answerText: answerText || null,
          esCorrecta,
        };
      }

      const selectedOptionId = this.selectedOptionAnswers[question.id] || null;
      const correctOption = question.options.find((option) => option.esCorrecta);
      const esCorrecta = !!correctOption && selectedOptionId === correctOption.id;

      if (esCorrecta) {
        puntajeObtenido += question.puntaje;
      }

      return {
        questionId: question.id,
        selectedOptionId,
        answerText: null,
        esCorrecta,
      };
    });

    return {
      puntajeObtenido,
      puntajeTotal,
      answers,
    };
  }

  private resetAnswerDraft(): void {
    this.selectedOptionAnswers = {};
    this.textAnswers = {};
  }

  private setupCourseTimer(): void {
    this.clearCountdownInterval();
    this.countdownEndsAt = null;
    this.moduleTimeLimitMinutes = Math.max(Number(this.currentModuleData?.course.duracion || 0), 0);

    if (!this.hasTimeLimit) {
      this.remainingSeconds = 0;
      return;
    }

    const totalCourseSeconds = this.moduleTimeLimitMinutes * 60;
    const storedTimer = this.getStoredCourseTimerState();

    if (!storedTimer) {
      this.remainingSeconds = totalCourseSeconds;
      return;
    }

    this.courseStartedAt = storedTimer.startedAt;

    if (storedTimer.endsAt) {
      const recalculatedRemaining = this.calculateRemainingSeconds(storedTimer.endsAt);
      this.remainingSeconds = recalculatedRemaining;

      if (recalculatedRemaining <= 0) {
        this.handleTimeExpired();
        return;
      }

      if (storedTimer.activeModuleId === this.currentModule?.id) {
        this.moduleStarted = true;
        this.startCountdown(storedTimer.endsAt);
        return;
      }

      this.persistCourseTimerState({
        startedAt: storedTimer.startedAt,
        remainingSeconds: recalculatedRemaining,
        endsAt: null,
        activeModuleId: null,
      });
      return;
    }

    this.remainingSeconds = storedTimer.remainingSeconds;

    if (this.remainingSeconds <= 0 && !this.isCurrentModuleCompleted) {
      this.moduleExpired = true;
      this.showErrorAlert("Ya no queda tiempo disponible para continuar el curso.");
    }
  }

  private startCountdown(endsAt: number): void {
    this.clearCountdownInterval();
    this.countdownEndsAt = endsAt;
    this.remainingSeconds = this.calculateRemainingSeconds(endsAt);

    this.countdownIntervalId = setInterval(() => {
      this.remainingSeconds = this.calculateRemainingSeconds(endsAt);

      if (this.remainingSeconds <= 0) {
        this.handleTimeExpired();
      }
    }, 1000);
  }

  private pauseCourseTimer(): void {
    if (!this.hasTimeLimit) {
      return;
    }

    const remainingSeconds = this.countdownEndsAt
      ? this.calculateRemainingSeconds(this.countdownEndsAt)
      : this.remainingSeconds;

    this.clearCountdownInterval();
    this.remainingSeconds = remainingSeconds;
    this.moduleStarted = false;

    this.persistCourseTimerState({
      startedAt: this.courseStartedAt,
      remainingSeconds,
      endsAt: null,
      activeModuleId: null,
    });
  }

  private handleTimeExpired(): void {
    this.clearCountdownInterval();
    this.remainingSeconds = 0;
    this.persistCourseTimerState({
      startedAt: this.courseStartedAt,
      remainingSeconds: 0,
      endsAt: null,
      activeModuleId: null,
    });

    if (this.isCurrentModuleCompleted || this.saving) {
      return;
    }

    this.moduleStarted = true;
    this.moduleExpired = true;
    this.showErrorAlert("Se acabo el tiempo del curso. Se enviaran tus respuestas automaticamente.");
    this.submitCurrentModule(true);
  }

  private clearCountdownInterval(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }

    this.countdownEndsAt = null;
  }

  private calculateRemainingSeconds(endsAt: number): number {
    return Math.max(Math.ceil((endsAt - Date.now()) / 1000), 0);
  }

  private getCourseTimerStorageKey(): string {
    return `course-timer:${this.userId}:${this.courseId}`;
  }

  private persistCourseTimerState(timerState: CourseTimerState): void {
    sessionStorage.setItem(this.getCourseTimerStorageKey(), JSON.stringify(timerState));
  }

  private getStoredCourseTimerState(): CourseTimerState | null {
    const rawTimer = sessionStorage.getItem(this.getCourseTimerStorageKey());

    if (!rawTimer) {
      return null;
    }

    try {
      return JSON.parse(rawTimer) as CourseTimerState;
    } catch {
      sessionStorage.removeItem(this.getCourseTimerStorageKey());
      return null;
    }
  }

  private clearCourseTimerState(): void {
    this.clearCountdownInterval();
    sessionStorage.removeItem(this.getCourseTimerStorageKey());
  }

  private padTime(value: number): string {
    return String(value).padStart(2, "0");
  }

  private showSuccessAlert(message: string): void {
    this.alertMessage = message;
    this.showSuccess = true;
    this.showError = false;
  }

  private showErrorAlert(message: string): void {
    this.alertMessage = message;
    this.showError = true;
    this.showSuccess = false;
  }

  hideAlerts(): void {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }
}




