import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CoursePlayerFacadeService } from "../../features/course-player/course-player-facade.service";
import { EnrollmentsApiService } from "../../features/enrollments/enrollments.service";
import { ModuleAttemptsApiService } from "../../features/module-attempts/module-attempts.service";
import { CourseModule } from "../../models/entities/course-module.model";
import { ModuleAttempt } from "../../models/entities/module-attempt.model";

interface ModuleProgressItem {
  moduleId: string;
  titulo: string;
  estado: "pendiente" | "en_progreso" | "completado";
  aprobado: boolean;
  puntajeObtenido: number;
  puntajeTotal: number;
  porcentajeLogro: number;
  fechaInicio: string | null;
  fechaTermino: string | null;
  duracionMinutos: number | null;
}

@Component({
  selector: "mi_progreso",
  templateUrl: "./mi_progreso.html",
  styleUrls: ["./mi_progreso.css"],
})
export class MiProgreso implements OnInit {
  userId = "";
  cursoId = "";
  loading = true;
  hasEnrollment = false;
  courseTitle = "";
  courseDescription = "";
  enrollmentProgress = 0;
  totalScore = 0;
  totalPossibleScore = 0;
  completedModules = 0;
  approvedModules = 0;
  averageModuleScore = 0;
  totalTimeSpentMinutes = 0;
  modules: ModuleProgressItem[] = [];
  scoreChartOptions: any;
  statusChartOptions: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursePlayerFacade: CoursePlayerFacadeService,
    private enrollmentsApiService: EnrollmentsApiService,
    private moduleAttemptsApiService: ModuleAttemptsApiService
  ) {}

  ngOnInit(): void {
    this.cursoId = this.route.snapshot.paramMap.get("cursoId") || "";
    this.userId = localStorage.getItem("user_Id") || "";

    if (!this.cursoId || !this.userId) {
      this.loading = false;
      return;
    }

    this.loadData();
  }

  get scorePercent(): number {
    if (!this.totalPossibleScore) {
      return 0;
    }

    return Math.round((this.totalScore / this.totalPossibleScore) * 100);
  }

  get pendingModules(): number {
    return Math.max(this.modules.length - this.completedModules, 0);
  }

  get approvalRate(): number {
    if (!this.completedModules) {
      return 0;
    }

    return Math.round((this.approvedModules / this.completedModules) * 100);
  }

  goBack(): void {
    this.router.navigate(["/ver_mi_progreso"]);
  }

  getStatusLabel(module: ModuleProgressItem): string {
    if (module.estado === "pendiente") {
      return "Pendiente";
    }

    if (module.estado === "en_progreso") {
      return "En progreso";
    }

    return module.aprobado ? "Completado y aprobado" : "Completado";
  }

  getStatusClass(module: ModuleProgressItem): string {
    if (module.estado === "pendiente") {
      return "status-chip status-pending";
    }

    if (module.estado === "en_progreso") {
      return "status-chip status-progress";
    }

    return module.aprobado
      ? "status-chip status-approved"
      : "status-chip status-completed";
  }

  formatDate(value: string | null): string {
    if (!value) {
      return "Sin registro";
    }

    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  private loadData(): void {
    this.loading = true;

    forkJoin({
      detail: this.coursePlayerFacade.getCourseDetail(this.cursoId),
      enrollments: this.enrollmentsApiService.getAll(),
      attempts: this.moduleAttemptsApiService.getAll(),
    }).subscribe({
      next: ({ detail, enrollments, attempts }) => {
        this.courseTitle = detail.course.nombre;
        this.courseDescription = detail.course.descripcionGeneral || "Sin descripción adicional.";

        const enrollment = enrollments.find(
          (item) => item.courseId === this.cursoId && item.userId === this.userId
        );

        if (!enrollment) {
          this.hasEnrollment = false;
          this.modules = detail.modules.map((module) => this.buildPendingModule(module));
          this.buildCharts();
          this.loading = false;
          return;
        }

        this.hasEnrollment = true;
        this.enrollmentProgress = enrollment.progreso || 0;

        const attemptsByModuleId = attempts
          .filter((attempt) => attempt.enrollmentId === enrollment.id)
          .reduce((accumulator: Record<string, ModuleAttempt>, attempt) => {
            const current = accumulator[attempt.moduleId];
            accumulator[attempt.moduleId] = this.pickLatestAttempt(current, attempt);
            return accumulator;
          }, {});

        this.modules = detail.modules.map((module) =>
          this.buildModuleProgress(module, attemptsByModuleId[module.id])
        );

        this.calculateSummary();
        this.buildCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar el progreso del curso:", error);
        this.loading = false;
      },
    });
  }

  private buildPendingModule(module: CourseModule): ModuleProgressItem {
    return {
      moduleId: module.id,
      titulo: module.titulo,
      estado: "pendiente",
      aprobado: false,
      puntajeObtenido: 0,
      puntajeTotal: 0,
      porcentajeLogro: 0,
      fechaInicio: null,
      fechaTermino: null,
      duracionMinutos: null,
    };
  }

  private buildModuleProgress(
    module: CourseModule,
    attempt?: ModuleAttempt
  ): ModuleProgressItem {
    if (!attempt) {
      return this.buildPendingModule(module);
    }

    const porcentajeLogro = attempt.puntajeTotal
      ? Math.round((attempt.puntajeObtenido / attempt.puntajeTotal) * 100)
      : 0;

    return {
      moduleId: module.id,
      titulo: module.titulo,
      estado: attempt.fechaTermino ? "completado" : "en_progreso",
      aprobado: !!attempt.aprobado,
      puntajeObtenido: attempt.puntajeObtenido || 0,
      puntajeTotal: attempt.puntajeTotal || 0,
      porcentajeLogro,
      fechaInicio: attempt.fechaInicio || null,
      fechaTermino: attempt.fechaTermino || null,
      duracionMinutos: this.calculateAttemptMinutes(attempt),
    };
  }

  private pickLatestAttempt(
    current: ModuleAttempt | undefined,
    candidate: ModuleAttempt
  ): ModuleAttempt {
    if (!current) {
      return candidate;
    }

    const currentDate = new Date(current.fechaTermino || current.fechaInicio || 0).getTime();
    const candidateDate = new Date(candidate.fechaTermino || candidate.fechaInicio || 0).getTime();
    return candidateDate >= currentDate ? candidate : current;
  }

  private calculateSummary(): void {
    this.completedModules = this.modules.filter((module) => module.estado === "completado").length;
    this.approvedModules = this.modules.filter(
      (module) => module.estado === "completado" && module.aprobado
    ).length;
    this.totalScore = this.modules.reduce((sum, module) => sum + module.puntajeObtenido, 0);
    this.totalPossibleScore = this.modules.reduce((sum, module) => sum + module.puntajeTotal, 0);
    this.averageModuleScore = this.completedModules
      ? Math.round(
          this.modules
            .filter((module) => module.estado === "completado")
            .reduce((sum, module) => sum + module.porcentajeLogro, 0) / this.completedModules
        )
      : 0;
    this.totalTimeSpentMinutes = this.modules.reduce(
      (sum, module) => sum + (module.duracionMinutos || 0),
      0
    );
  }

  private buildCharts(): void {
    this.scoreChartOptions = {
      series: [
        {
          name: "Logro por módulo",
          data: this.modules.map((module) => module.porcentajeLogro),
        },
      ],
      chart: {
        type: "bar",
        height: 320,
        toolbar: { show: false },
      },
      colors: ["#0d6efd"],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "48%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (value: number) => `${Math.round(value)}%`,
      },
      xaxis: {
        categories: this.modules.map((module) => module.titulo),
        labels: {
          rotate: -25,
          trim: true,
        },
      },
      yaxis: {
        max: 100,
        min: 0,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => `${Math.round(value)}%`,
        },
      },
      grid: {
        borderColor: "#e9eef5",
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)}% de logro`,
        },
      },
    };

    this.statusChartOptions = {
      series: [this.completedModules, this.pendingModules],
      chart: {
        type: "donut",
        height: 320,
      },
      labels: ["Módulos completados", "Módulos pendientes"],
      colors: ["#12b886", "#dbe4f3"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        colors: ["#ffffff"],
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value} módulo(s)`,
        },
      },
    };
  }

  private calculateAttemptMinutes(attempt: ModuleAttempt): number | null {
    if (!attempt.fechaInicio || !attempt.fechaTermino) {
      return null;
    }

    const start = new Date(attempt.fechaInicio).getTime();
    const end = new Date(attempt.fechaTermino).getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return null;
    }

    return Math.max(1, Math.round((end - start) / 60000));
  }
}
