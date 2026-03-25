import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthSessionService } from "../core/services/auth-session.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authSessionService: AuthSessionService
  ) {}

  canActivate(): boolean {
    if (this.authSessionService.isAuthenticated) {
      console.log("Usuario autenticado. Permitiendo acceso.");
      return true;
    } else {
      console.log("No se ha detectado ningún token. Redirigiendo al login.");
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
