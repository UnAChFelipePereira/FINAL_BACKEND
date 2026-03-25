import { Component, OnDestroy, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AppSettings } from "../../../service/app-settings.service";
import { AuthService } from "../../../components/auth/auth.service";

@Component({
  selector: "register-v2",
  templateUrl: "./register-v2.html",
})
export class RegisterV2Page implements OnDestroy {
  userData = {
    nombre: "",
    apellido: "",
    email: "",
    reemail: "",
    password: "",
  };
  showPassword = false;
  showError = false;
  showSuccess = false;
  alertMessage = "";

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public appSettings: AppSettings,
    private authService: AuthService
  ) {
    this.appSettings.appEmpty = true;
    this.renderer.addClass(document.body, "bg-white");
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
    this.renderer.removeClass(document.body, "bg-white");
  }

  formSubmit(f: NgForm) {
    const formData = f.value;
    formData.nombre = this.sanitizeAndFormatName(formData.nombre);
    formData.apellido = this.sanitizeAndFormatName(formData.apellido);
    formData.email = this.normalizeEmail(formData.email);
    formData.reemail = this.normalizeEmail(formData.reemail);

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.reemail ||
      !formData.password
    ) {
      this.showErrorAlert("Por favor, completa todos los campos.");
      return;
    }

    if (!f.valid) {
      return;
    }

    if (formData.email !== formData.reemail) {
      this.showErrorAlert("Los correos no coinciden.");
      return;
    }

    if (!this.validarDominio(formData.email)) {
      this.showErrorAlert(
        "El correo debe pertenecer a @alu.unach.cl o @unach.cl."
      );
      return;
    }

    this.authService
      .register(
        formData.nombre,
        formData.apellido,
        formData.email,
        formData.password
      )
      .subscribe({
        next: () => {
          const roleLabel = this.resolveRoleByDomain(formData.email);
          this.showSuccessAlert(
            `Cuenta registrada correctamente como ${roleLabel}. Redirigiendo al login...`
          );
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 5000);
        },
        error: (error) => {
          console.error("Error al registrar:", error);

          if (error.status === 404) {
            this.showErrorAlert(
              "El endpoint de registro configurado no existe en el backend actual."
            );
            return;
          }

          this.showErrorAlert("No se pudo registrar la cuenta. Revisa el correo o intentalo nuevamente.");
        },
      });
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 20000);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 20000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }

  validarDominio(email: string): boolean {
    return !!this.resolveRoleByDomain(email);
  }

  resolveRoleByDomain(email: string): string {
    const normalizedEmail = this.normalizeEmail(email);

    if (normalizedEmail.endsWith("@alu.unach.cl")) {
      return "estudiante";
    }

    if (normalizedEmail.endsWith("@unach.cl")) {
      return "docente";
    }

    return "";
  }

  normalizeEmail(email: string): string {
    return (email || "").trim().toLowerCase();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  sanitizeAndFormatName(name: string): string {
    const sanitized = (name || "").replace(/[^a-zA-Z�-�\s]/g, "").trim();

    if (!sanitized) {
      return "";
    }

    return sanitized
      .split(/\s+/)
      .map(
        (part: string) =>
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(" ");
  }
}
