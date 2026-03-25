import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { QuestionOption } from "../../models/entities/question-option.model";

export interface CreateQuestionOptionPayload {
  questionId: string;
  texto: string;
  esCorrecta: boolean;
  orden: number;
}

@Injectable({
  providedIn: "root",
})
export class QuestionOptionsApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("question-options");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<QuestionOption[]> {
    return this.http.get<QuestionOption[]>(this.baseUrl);
  }

  getById(id: string): Observable<QuestionOption> {
    return this.http.get<QuestionOption>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateQuestionOptionPayload): Observable<QuestionOption> {
    return this.http.post<QuestionOption>(this.baseUrl, payload);
  }

  update(
    id: string,
    payload: Partial<CreateQuestionOptionPayload>
  ): Observable<QuestionOption> {
    return this.http.patch<QuestionOption>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<QuestionOption> {
    return this.http.delete<QuestionOption>(`${this.baseUrl}/${id}`);
  }
}
