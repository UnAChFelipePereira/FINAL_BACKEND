import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { CourseModule } from "../../models/entities/course-module.model";

export interface CreateCourseModulePayload {
  courseId: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
}

@Injectable({
  providedIn: "root",
})
export class CourseModulesApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("course-modules");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(this.baseUrl);
  }

  getById(id: string): Observable<CourseModule> {
    return this.http.get<CourseModule>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateCourseModulePayload): Observable<CourseModule> {
    return this.http.post<CourseModule>(this.baseUrl, payload);
  }

  update(
    id: string,
    payload: Partial<CreateCourseModulePayload>
  ): Observable<CourseModule> {
    return this.http.patch<CourseModule>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<CourseModule> {
    return this.http.delete<CourseModule>(`${this.baseUrl}/${id}`);
  }
}
