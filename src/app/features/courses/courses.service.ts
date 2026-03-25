import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { Course } from "../../models/entities/course.model";

export interface CreateCoursePayload {
  nombre: string;
  descripcionGeneral: string | null;
  iconFileId: string | null;
  creadoPorId: string | null;
  duracion: number;
  activo: boolean;
}

@Injectable({
  providedIn: "root",
})
export class CoursesApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("courses");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateCoursePayload): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateCoursePayload>): Observable<Course> {
    return this.http.patch<Course>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<Course> {
    return this.http.delete<Course>(`${this.baseUrl}/${id}`);
  }
}
