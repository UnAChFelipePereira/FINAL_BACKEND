import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import {
  Observable,
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { environment } from "../../../environments/environment";
import { AuthSessionService } from "../../core/services/auth-session.service";
import { CurrentUser } from "../../core/models/current-user.model";
import { Curso } from "../../pages/vercursos/curso.model";
import { CourseEnrollment } from "../../models/entities/course-enrollment.model";

interface LegacyLoginResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: {
    _id?: string;
    id?: string;
    email: string;
    role?: string;
    rol?: string;
    name?: string;
    nombre?: string;
    lastname?: string;
    apellido?: string;
    activo?: boolean;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService implements CanActivate {
  private readonly apiUrl = environment.apiUrl;

  private readonly apiUrllogin = `${this.apiUrl}/users/login`;
  private readonly apiUrlregister = `${this.apiUrl}/users`;
  private readonly apiUrlActivateAccount = `${this.apiUrl}/users/activate-account`;
  private readonly apiUrlperfil = `${this.apiUrl}/users/perfil`;
  private readonly apiUrlforgot = `${this.apiUrl}/users/forgot-password`;
  private readonly apiUrlreset = `${this.apiUrl}/users/reset-password`;
  private readonly apiUrlchange = `${this.apiUrl}/users/change-password`;
  private readonly apiUrlfoto = `${this.apiUrl}/users/upload-profile-picture`;
  private readonly apiUrlUsers = `${this.apiUrl}/users`;

  private readonly apiUrlLegacyCourses = `${this.apiUrl}/cursos`;
  private readonly apiUrlCourses = `${this.apiUrl}/courses`;
  private readonly apiUrlEventos = `${this.apiUrl}/eventos`;
  private readonly apiUrlPrimerafase = `${this.apiUrl}/primerafase`;
  private readonly apiUrlFilesUpload = `${this.apiUrl}/files/upload`;
  private readonly apiUrlFiles = `${this.apiUrl}/files`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authSessionService: AuthSessionService
  ) {}

  register(
    nombre: string,
    apellido: string,
    email: string,
    password: string
  ): Observable<any> {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const resolvedRole = this.resolveRoleByEmail(normalizedEmail);

    if (!resolvedRole) {
      return throwError(
        () => new Error("El correo debe pertenecer a @unach.cl o @alu.unach.cl.")
      );
    }

    return this.http.post<any>(this.apiUrlregister, {
      email: normalizedEmail,
      nombre,
      apellido,
      password,
      rol: resolvedRole,
      activo: false,
    });
  }

  login(email: string, password: string): Observable<LegacyLoginResponse> {
    return this.http
      .post<LegacyLoginResponse>(this.apiUrllogin, { email, password })
      .pipe(
        switchMap(async (response) => {
          const accessToken =
            response.access_token || response.accessToken || response.token || "";
          const rawUser = response.user;
          const resolvedUserId = await this.resolveRelationalUserId(
            rawUser?.id || rawUser?._id || "",
            rawUser?.email || email
          );

          const user: CurrentUser | null = rawUser
            ? {
                id: resolvedUserId,
                email: rawUser.email,
                nombre: rawUser.nombre || rawUser.name || "",
                apellido: rawUser.apellido || rawUser.lastname || "",
                rol: (rawUser.rol || rawUser.role || "estudiante") as CurrentUser["rol"],
                activo: rawUser.activo ?? true,
              }
            : null;

          if (accessToken) {
            this.authSessionService.setSession({
              accessToken,
              user,
            });
          }

          if (rawUser?.role) {
            localStorage.setItem("userRole", rawUser.role);
          }
          return response;
        })
      );
  }

  activateAccount(token: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrlActivateAccount, { token })
      .pipe(catchError(this.handleErrors));
  }

  perfil(
    email: string,
    name: string,
    lastname: string,
    profilePic: string
  ): Observable<any> {
    return this.http.post<any>(this.apiUrlperfil, {
      email,
      name,
      lastname,
      profilePic,
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrlperfil);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrlforgot, { email });
  }

  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.put<any>(this.apiUrlchange, {
      email,
      oldPassword,
      newPassword,
    });
  }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    return this.http.put<any>(this.apiUrlreset, {
      newPassword,
      resetToken,
    });
  }

  uploadProfilePic(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("profilePic", file);

    return this.http.post<any>(this.apiUrlfoto, formData);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlUsers}/${userId}`);
  }

  getCursos(): Observable<Curso[]> {
    return forkJoin({
      courses: this.http.get<any[]>(this.apiUrlCourses),
      users: this.http.get<any[]>(this.apiUrlUsers).pipe(catchError(() => of([]))),
      files: this.http.get<any[]>(this.apiUrlFiles).pipe(catchError(() => of([]))),
    }).pipe(
      map(({ courses, users, files }) =>
        courses.map((course) => this.mapCourseToLegacy(course, users, files))
      )
    );
  }
  getIdCursos(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsers);
  }

  deleteCursoById(cursoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrlCourses}/${cursoId}`);
  }

  getCursoById(cursoId: string): Observable<any> {
    return forkJoin({
      course: this.http.get<any>(`${this.apiUrlCourses}/${cursoId}`),
      users: this.http.get<any[]>(this.apiUrlUsers).pipe(catchError(() => of([]))),
      files: this.http.get<any[]>(this.apiUrlFiles).pipe(catchError(() => of([]))),
    }).pipe(map(({ course, users, files }) => this.mapCourseToLegacy(course, users, files)));
  }
  updateCurso(id: string, cursoData: any): Observable<any> {
    return this.http.patch(`${this.apiUrlCourses}/${id}`, cursoData);
  }

  updateCursoEstado(cursoId: string, estado: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrlCourses}/${cursoId}`, { activo: estado });
  }

  enrollUserInCurso(userId: string, cursoId: string): Observable<any> {
    const providedUserId =
      userId || this.authSessionService.currentUser?.id || localStorage.getItem("user_Id") || "";
    const normalizedCourseId = this.normalizeNumericId(cursoId);

    if (!normalizedCourseId) {
      return throwError(
        () =>
          new Error(
            "No se encontrÃƒÂ³ un courseId relacional vÃƒÂ¡lido para la inscripciÃƒÂ³n."
          )
      );
    }

    return this.resolveEnrollmentUserId(providedUserId).pipe(
      switchMap((normalizedUserId) => {
        if (!normalizedUserId) {
          return throwError(
            () =>
              new Error(
                "No se encontrÃƒÂ³ un userId relacional vÃƒÂ¡lido para inscribir al usuario."
              )
          );
        }

        return this.http.post<any>(`${this.apiUrl}/course-enrollments`, {
          userId: normalizedUserId,
          courseId: normalizedCourseId,
          fechaInscripcion: new Date().toISOString(),
          estado: "inscrito",
          progreso: 0,
        });
      })
    );
  }

  getEnrolledCursos(userId: string): Observable<any> {
    const providedUserId =
      userId || this.authSessionService.currentUser?.id || localStorage.getItem("user_Id") || "";

    return this.resolveEnrollmentUserId(providedUserId).pipe(
      switchMap((normalizedUserId) => {
        if (!normalizedUserId) {
          return of({ cursosInscritos: [] });
        }

        return this.http.get<CourseEnrollment[]>(`${this.apiUrl}/course-enrollments`).pipe(
          map((enrollments) => ({
            cursosInscritos: enrollments
              .filter(
                (enrollment) =>
                  this.normalizeNumericId(enrollment.userId) === normalizedUserId
              )
              .map((enrollment) => enrollment.courseId),
          }))
        );
      })
    );
  }

  getCursosInscritos(userId: string): Observable<any> {
    return this.getEnrolledCursos(userId);
  }

  crearcurso(...args: any[]): Observable<any> {
    const [
      nombre,
      ,
      ,
      descripcionGeneral,
      ,
      iconFileId,
      ...rest
    ] = args;

    const creadoPorId = localStorage.getItem("user_Id");

    return this.http.post<any>(this.apiUrlCourses, {
      nombre,
      descripcionGeneral: descripcionGeneral || null,
      iconFileId: iconFileId || null,
      creadoPorId: creadoPorId || null,
      activo: rest[rest.length - 1] ?? true,
    });
  }

  updateArchivoNombre(cursoId: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrlCourses}/${cursoId}`, data);
  }

  addEvento(evento: any): Observable<any> {
    const headers = new HttpHeaders();

    return this.http
      .post<any>(`${this.apiUrlEventos}/crear`, evento, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("Error al agregar evento:", error);
          return throwError(() => error);
        })
      );
  }

  guardarPosicionCurso(
    cursoId: string,
    userId: string,
    nuevaPosicion: any
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrlEventos}/crear/${userId}/${cursoId}`, {
      userId,
      cursoId,
      nuevaPosicion,
    });
  }

  actualizarPosicionCurso(
    cursoId: string,
    userId: string,
    nuevaPosicion: Date
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrlEventos}/${userId}/${cursoId}/posicion`,
      {
        nuevaPosicion,
      }
    );
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlEventos);
  }

  checkIfCourseCompleted(
    cursoId: string,
    userId: string,
    faseId: string
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrlPrimerafase}/${cursoId}/${userId}/${faseId}/completed`
    );
  }

  getCursosRealizados(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrlPrimerafase}/cursos-realizados/${userId}`);
  }

  getDatos(): Observable<any> {
    return this.http.get<any>(this.apiUrlPrimerafase);
  }

  uploadDoc(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<any>(this.apiUrlFilesUpload, formData);
  }

  startCourse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlPrimerafase}/start-course`, data);
  }

  endCourse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlPrimerafase}/end-course`, data);
  }

  checkIfCourseStarted(
    cursoId: string,
    userId: string,
    faseId: string
  ): Observable<{ started: boolean; startTime: string }> {
    return this.http.get<{ started: boolean; startTime: string }>(
      `${this.apiUrlPrimerafase}/check-started/${cursoId}/${userId}/${faseId}`
    );
  }

  getCursosByEmail(userEmail: string): Observable<any> {
    return this.http.get(
      `${this.apiUrlLegacyCourses}/mis_cursos_creados?userEmail=${userEmail}`
    );
  }

  getAllCursos(): Observable<any> {
    return this.http.get(`${this.apiUrlLegacyCourses}/mis_cursos_creados`);
  }

  logout(): void {
    this.authSessionService.clearSession();
    this.router.navigate(["/login"]);
  }

  getCurrentUserRole(): string {
    return (
      this.authSessionService.currentUser?.rol ||
      JSON.parse(localStorage.getItem("user") || "{}").rol ||
      "estudiante"
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    void state;

    if (!this.authSessionService.isAuthenticated) {
      this.router.navigate(["/login"]);
      return false;
    }

    const expectedRoles =
      route.data["expectedRoles"] ||
      route.data["expectedRole"] ||
      route.data["expectedRoless"];

    if (!expectedRoles) {
      return true;
    }

    const allowedRoles = Array.isArray(expectedRoles)
      ? expectedRoles
      : [expectedRoles];

    if (!this.authSessionService.hasAnyRole(allowedRoles)) {
      this.router.navigate(["/inicio"]);
      return false;
    }

    return true;
  }

  private handleErrors(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private normalizeNumericId(value: string | null | undefined): string {
    if (!value) {
      return "";
    }

    const normalized = String(value).trim();
    return /^\d+$/.test(normalized) ? normalized : "";
  }

  private resolveEnrollmentUserId(candidateId: string): Observable<string> {
    const normalizedCandidate = this.normalizeNumericId(candidateId);

    if (normalizedCandidate) {
      return of(normalizedCandidate);
    }

    const fallbackEmail =
      this.authSessionService.currentUser?.email || localStorage.getItem("userEmail") || "";

    if (!fallbackEmail) {
      return of("");
    }

    return this.http.get<any[]>(this.apiUrlUsers).pipe(
      map((users) => {
        const matchedUser = users.find((user) => user.email === fallbackEmail);

        if (!matchedUser) {
          return "";
        }

        const resolvedId = this.normalizeNumericId(matchedUser.id);

        if (resolvedId) {
          localStorage.setItem("user_Id", resolvedId);

          const currentUser = this.authSessionService.currentUser;
          if (currentUser) {
            this.authSessionService.setSession({
              accessToken: this.authSessionService.accessToken,
              user: {
                ...currentUser,
                id: resolvedId,
              },
            });
          }
        }

        return resolvedId;
      })
    );
  }

  private async resolveRelationalUserId(
    candidateId: string,
    email: string
  ): Promise<string> {
    const normalizedCandidate = this.normalizeNumericId(candidateId);

    if (normalizedCandidate) {
      return normalizedCandidate;
    }

    if (!email) {
      return "";
    }

    try {
      const users = await firstValueFrom(this.http.get<any[]>(this.apiUrlUsers));
      const matchedUser = users.find((user) => user.email === email);
      return this.normalizeNumericId(matchedUser?.id);
    } catch {
      return "";
    }
  }

  private resolveRoleByEmail(email: string): "docente" | "estudiante" | "" {
    if (email.endsWith("@alu.unach.cl")) {
      return "estudiante";
    }

    if (email.endsWith("@unach.cl")) {
      return "docente";
    }

    return "";
  }

  private mapCourseToLegacy(course: any, users: any[] = [], files: any[] = []): Curso {
    const teacher = users.find(
      (user) => this.normalizeNumericId(user.id) === this.normalizeNumericId(course.creadoPorId)
    );
    const teacherName = [teacher?.nombre, teacher?.apellido].filter(Boolean).join(" ").trim();
    const iconFile = files.find((file) => String(file.id) === String(course.iconFileId));
    const resolvedIcon = this.normalizeCourseIconPath(
      course.iconUrl ||
      course.iconFilePath ||
      course.iconFile?.path ||
      iconFile?.path ||
      "/assets/img/subir/logo-unach-fin.jpg"
    );

    return {
      _id: course.id,
      nombre_curso: course.nombre,
      nombre_profesor: teacherName || course.creadoPorId || "Docente asignado",
      iconocursoNombre: resolvedIcon,
      descripcion: course.descripcionGeneral || "",
      iconocurso: course.iconFileId || "",
      estado: course.activo,
      duracion: Number(course.duracion || 0),
    };
  }

  private normalizeCourseIconPath(path: string): string {
    if (!path) {
      return "/assets/img/subir/logo-unach-fin.jpg";
    }

    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/assets/")) {
      return encodeURI(path);
    }

    if (path.startsWith("/uploads/")) {
      return encodeURI(`${this.apiUrl}${path}`);
    }

    return encodeURI(path);
  }
}

