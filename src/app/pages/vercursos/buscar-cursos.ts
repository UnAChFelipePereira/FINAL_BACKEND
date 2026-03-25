import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../components/auth/auth.service";
import { Curso } from "./curso.model";

@Component({
  selector: "extra-search-results",
  templateUrl: "./buscar-cursos.html",
  styleUrls: ["./buscar-cursos.css"],
})
export class BuscarCursosPage implements OnInit {
  cursos: Curso[] = [];
  cursosOriginales: Curso[] = [];
  cursosInscritos: string[] = [];
  userId: string | null = null;
  showError = false;
  showSuccess = false;
  alertMessage = "";
  terminoBusqueda = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("user_Id");

    if (this.userId) {
      this.getEnrolledCursos(this.userId);
    }

    this.loadAllCursos();
  }

  getEnrolledCursos(userId: string): void {
    this.authService.getEnrolledCursos(userId).subscribe({
      next: (response: { cursosInscritos: string[] }) => {
        this.cursosInscritos = response.cursosInscritos || [];
      },
      error: (error) => {
        console.error("Error al obtener cursos inscritos:", error);
      },
    });
  }

  loadAllCursos(): void {
    this.authService.getCursos().subscribe({
      next: (response: Curso[]) => {
        this.cursosOriginales = response.filter((curso) => curso.estado === true);
        this.cursos = [...this.cursosOriginales];
      },
      error: (error) => {
        console.error("Error al obtener cursos:", error);
      },
    });
  }

  buscarCursos(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    if (!termino) {
      this.cursos = [...this.cursosOriginales];
      return;
    }

    this.cursos = this.cursosOriginales.filter((curso) =>
      curso.nombre_curso.toLowerCase().includes(termino)
    );
  }

  enrollUserInCurso(cursoId: string): void {
    if (this.cursosInscritos.includes(cursoId)) {
      this.showErrorAlert("Ya estás inscrito en este curso.");
      return;
    }

    if (!this.userId) {
      console.error("No se encontró el ID del usuario en localStorage.");
      return;
    }

    this.authService.enrollUserInCurso(this.userId, cursoId).subscribe({
      next: () => {
        this.cursosInscritos.push(cursoId);
        this.showSuccessAlert("Te has inscrito en el curso exitosamente.");
        this.router.navigate(["/mis-cursos"]);
      },
      error: (error) => {
        console.error("Error al inscribir usuario:", error);
        this.showErrorAlert("Error al inscribir usuario en el curso.");
      },
    });
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
