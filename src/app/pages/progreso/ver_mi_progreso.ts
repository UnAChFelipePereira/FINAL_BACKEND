import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AuthService } from "../../components/auth/auth.service";
import { EnrollmentsApiService } from "../../features/enrollments/enrollments.service";
import { Curso } from "./curso.model";

@Component({
  selector: "extra-search-results",
  templateUrl: "./ver_mi_progreso.html",
  styleUrls: ["./ver_mi_progreso.css"],
})
export class VerMiProgreso implements OnInit {
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
      console.error("No se encontró el ID del usuario en localStorage.");
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
              })
              .sort((a, b) => (b.progresoInscripcion || 0) - (a.progresoInscripcion || 0));

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

  realizarCurso(cursoId: string): void {
    this.router.navigate(["/mi_progreso", cursoId]);
  }

  getEnrollmentStatusLabel(curso: Curso): string {
    if (curso.estadoInscripcion === "completado" || (curso.progresoInscripcion || 0) >= 100) {
      return "Completado";
    }

    if (curso.estadoInscripcion === "en_progreso" || (curso.progresoInscripcion || 0) > 0) {
      return "En progreso";
    }

    return "Inscrito";
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 5000);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 5000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }
}
