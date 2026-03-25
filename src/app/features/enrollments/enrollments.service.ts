import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { CourseEnrollment } from "../../models/entities/course-enrollment.model";
import { toNumber } from "../../core/utils/number.utils";

interface RawEnrollment extends Omit<CourseEnrollment, "progreso"> {
  progreso: string | number;
}

export interface CreateEnrollmentPayload {
  userId: string;
  courseId: string;
  fechaInscripcion: string;
  estado: CourseEnrollment["estado"];
  progreso: number;
}

@Injectable({
  providedIn: "root",
})
export class EnrollmentsApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("course-enrollments");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<CourseEnrollment[]> {
    return this.http
      .get<RawEnrollment[]>(this.baseUrl)
      .pipe(map((items) => items.map((item) => this.normalize(item))));
  }

  getById(id: string): Observable<CourseEnrollment> {
    return this.http
      .get<RawEnrollment>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  create(payload: CreateEnrollmentPayload): Observable<CourseEnrollment> {
    return this.http
      .post<RawEnrollment>(this.baseUrl, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  update(
    id: string,
    payload: Partial<CreateEnrollmentPayload>
  ): Observable<CourseEnrollment> {
    return this.http
      .patch<RawEnrollment>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  delete(id: string): Observable<CourseEnrollment> {
    return this.http
      .delete<RawEnrollment>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  private normalize(item: RawEnrollment): CourseEnrollment {
    return {
      ...item,
      progreso: toNumber(item.progreso),
    };
  }
}
