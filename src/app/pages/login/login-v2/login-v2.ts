import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../../components/auth/auth.service";

@Component({
  selector: "login-v2",
  templateUrl: "./login-v2.html",
})
export class LoginV2Page {
  constructor(private authService: AuthService, private router: Router) {}

  formSubmit(f: NgForm) {
    if (!f.valid) {
      return;
    }

    const formData = f.value;

    this.authService.login(formData.email, formData.password).subscribe({
      next: (response) => {
        console.log("Respuesta del inicio de sesión:", response);

        const accessToken =
          response.access_token || response.accessToken || response.token || "";
        const refreshToken =
          (response as any).refresh_token || (response as any).refreshToken || "";
        const userId = response?.user?.id || response?.user?._id || "";
        const rol = response?.user?.rol || response?.user?.role || "";

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
        }

        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        if (userId) {
          localStorage.setItem("user_Id", userId);
        }

        if (rol) {
          localStorage.setItem("rol", rol);
        }

        this.router.navigate(["dashboard"]);
      },
      error: (error) => {
        console.error("Error al iniciar sesión:", error);
      },
    });
  }
}
