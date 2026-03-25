import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { UserAnswer } from "../../models/entities/user-answer.model";

export interface CreateUserAnswerPayload {
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
  answerText: string | null;
  esCorrecta: boolean;
  respondidoEn: string;
}

@Injectable({
  providedIn: "root",
})
export class UserAnswersApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("user-answers");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<UserAnswer[]> {
    return this.http.get<UserAnswer[]>(this.baseUrl);
  }

  getById(id: string): Observable<UserAnswer> {
    return this.http.get<UserAnswer>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateUserAnswerPayload): Observable<UserAnswer> {
    return this.http.post<UserAnswer>(this.baseUrl, payload);
  }

  update(
    id: string,
    payload: Partial<CreateUserAnswerPayload>
  ): Observable<UserAnswer> {
    return this.http.patch<UserAnswer>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<UserAnswer> {
    return this.http.delete<UserAnswer>(`${this.baseUrl}/${id}`);
  }
}
