import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AuthService } from "../../components/auth/auth.service";
import { EnrollmentsApiService } from "../../features/enrollments/enrollments.service";
import { Curso } from "../vercursos/curso.model";

@Component({
  selector: "mis-cursos",
  templateUrl: "./mis-cursos.html",
  styleUrls: ["./mis-cursos.css"],
})
export class MisCursosPage implements OnInit {
  cursosInscritos: Curso[] = [];
  cursosInscritosOriginales: Curso[] = [];
  user_Id: string;
  terminoBusqueda = "";
  showError = false;
  showSuccess = false;
  alertMessage = "";

  constructor(
    private authService: AuthService,
    private enrollmentsApiService: EnrollmentsApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user_Id = localStorage.getItem("user_Id");

    if (this.user_Id) {
      this.getEnrolledCursos(this.user_Id);
    } else {
      console.error("No se encontrÃ³ el ID del usuario en localStorage.");
    }
  }

  getEnrolledCursos(userId: string): void {
    this.authService.getEnrolledCursos(userId).subscribe({
      next: (response: { cursosInscritos: string[] }) => {
        const cursoIds = response.cursosInscritos || [];

        if (!cursoIds.length) {
          this.cursosInscritos = [];
          this.cursosInscritosOriginales = [];
          return;
        }

        forkJoin({
          cursos: forkJoin(cursoIds.map((cursoId) => this.authService.getCursoById(cursoId))),
          enrollments: this.enrollmentsApiService.getAll(),
        }).subscribe({
          next: ({ cursos, enrollments }) => {
            this.cursosInscritosOriginales = cursos
              .filter((curso) => curso.estado)
              .map((curso) => {
                const enrollment = enrollments.find(
                  (item) => item.courseId === curso._id && item.userId === this.user_Id
                );

                return {
                  ...curso,
                  progresoInscripcion: enrollment?.progreso || 0,
                  estadoInscripcion: enrollment?.estado || "inscrito",
                };
              });
            this.cursosInscritos = [...this.cursosInscritosOriginales];
          },
          error: (error) => {
            console.error("Error al obtener los detalles del curso:", error);
          },
        });
      },
      error: (error) => {
        console.error("Error al obtener cursos inscritos:", error);
      },
    });
  }

  buscarCursos(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    if (!termino) {
      this.cursosInscritos = [...this.cursosInscritosOriginales];
      return;
    }

    this.cursosInscritos = this.cursosInscritosOriginales.filter((curso) =>
      curso.nombre_curso.toLowerCase().includes(termino)
    );
  }

  abrirCurso(curso: Curso): void {
    if (this.isCursoCompletado(curso)) {
      this.router.navigate(["/resultado_curso", curso._id]);
      return;
    }

    this.router.navigate(["/curso", curso._id]);
  }

  getCourseActionLabel(curso: Curso): string {
    if (this.isCursoCompletado(curso)) {
      return "Ver Resultados";
    }

    if (this.hasCursoIniciado(curso)) {
      return "Continuar Curso";
    }

    return "Realizar curso";
  }

  private isCursoCompletado(curso: Curso): boolean {
    return curso.estadoInscripcion === "completado" || (curso.progresoInscripcion || 0) >= 100;
  }

  private hasCursoIniciado(curso: Curso): boolean {
    const progreso = curso.progresoInscripcion || 0;
    return curso.estadoInscripcion === "en_progreso" || (progreso > 0 && progreso < 100);
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showError = true;
    setTimeout(() => this.hideAlerts(), 5000);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => this.hideAlerts(), 5000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }
}
