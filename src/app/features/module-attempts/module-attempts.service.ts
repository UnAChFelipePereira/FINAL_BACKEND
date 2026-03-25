import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { ModuleAttempt } from "../../models/entities/module-attempt.model";
import { toNumber } from "../../core/utils/number.utils";

interface RawAttempt
  extends Omit<ModuleAttempt, "puntajeObtenido" | "puntajeTotal"> {
  puntajeObtenido: string | number;
  puntajeTotal: string | number;
}

export interface CreateModuleAttemptPayload {
  enrollmentId: string;
  moduleId: string;
  fechaInicio: string;
  fechaTermino: string | null;
  aprobado: boolean;
  puntajeObtenido: number;
  puntajeTotal: number;
}

@Injectable({
  providedIn: "root",
})
export class ModuleAttemptsApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("module-attempts");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<ModuleAttempt[]> {
    return this.http
      .get<RawAttempt[]>(this.baseUrl)
      .pipe(map((items) => items.map((item) => this.normalize(item))));
  }

  getById(id: string): Observable<ModuleAttempt> {
    return this.http
      .get<RawAttempt>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  create(payload: CreateModuleAttemptPayload): Observable<ModuleAttempt> {
    return this.http
      .post<RawAttempt>(this.baseUrl, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  update(
    id: string,
    payload: Partial<CreateModuleAttemptPayload>
  ): Observable<ModuleAttempt> {
    return this.http
      .patch<RawAttempt>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  delete(id: string): Observable<ModuleAttempt> {
    return this.http
      .delete<RawAttempt>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  private normalize(item: RawAttempt): ModuleAttempt {
    return {
      ...item,
      puntajeObtenido: toNumber(item.puntajeObtenido),
      puntajeTotal: toNumber(item.puntajeTotal),
    };
  }
}
