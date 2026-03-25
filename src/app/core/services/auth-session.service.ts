import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthSession } from "../models/auth-session.model";
import { CurrentUser } from "../models/current-user.model";
import { UserRole } from "../../models/common/role.type";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";
const USER_ROLE_KEY = "userRol";
const USER_EMAIL_KEY = "userEmail";
const USER_NAME_KEY = "userName";
const USER_LAST_NAME_KEY = "userLastName";
const USER_ID_KEY = "user_Id";

@Injectable({
  providedIn: "root",
})
export class AuthSessionService {
  private readonly sessionSubject = new BehaviorSubject<AuthSession>(
    this.readSession()
  );

  readonly session$ = this.sessionSubject.asObservable();

  get snapshot(): AuthSession {
    return this.sessionSubject.value;
  }

  get accessToken(): string {
    return this.snapshot.accessToken;
  }

  get currentUser(): CurrentUser | null {
    return this.snapshot.user;
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  setSession(session: AuthSession): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

    if (session.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      localStorage.setItem(USER_ROLE_KEY, session.user.rol);
      localStorage.setItem(USER_EMAIL_KEY, session.user.email);
      localStorage.setItem(USER_NAME_KEY, session.user.nombre);
      localStorage.setItem(USER_LAST_NAME_KEY, session.user.apellido);
      localStorage.setItem(USER_ID_KEY, session.user.id);
    }

    this.sessionSubject.next(session);
  }

  clearSession(): void {
    [
      ACCESS_TOKEN_KEY,
      USER_KEY,
      USER_ROLE_KEY,
      USER_EMAIL_KEY,
      USER_NAME_KEY,
      USER_LAST_NAME_KEY,
      USER_ID_KEY,
      "userRole",
      "userProfilePic",
    ].forEach((key) => localStorage.removeItem(key));

    this.sessionSubject.next({
      accessToken: "",
      user: null,
    });
  }

  hasAnyRole(roles: string[]): boolean {
    const currentRole = this.currentUser?.rol;
    return !!currentRole && roles.includes(currentRole);
  }

  private readSession(): AuthSession {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return {
        accessToken,
        user: null,
      };
    }

    try {
      return {
        accessToken,
        user: JSON.parse(rawUser) as CurrentUser,
      };
    } catch {
      return {
        accessToken,
        user: null,
      };
    }
  }
}
