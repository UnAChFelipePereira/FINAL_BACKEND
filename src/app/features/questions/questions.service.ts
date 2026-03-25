import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { Question } from "../../models/entities/question.model";
import { toNumber } from "../../core/utils/number.utils";

interface RawQuestion extends Omit<Question, "puntaje"> {
  puntaje: string | number;
}

export interface CreateQuestionPayload {
  moduleId: string;
  enunciado: string;
  tipoPregunta: Question["tipoPregunta"];
  orden: number;
  puntaje: number;
}

@Injectable({
  providedIn: "root",
})
export class QuestionsApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("questions");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<Question[]> {
    return this.http
      .get<RawQuestion[]>(this.baseUrl)
      .pipe(map((items) => items.map((item) => this.normalize(item))));
  }

  getById(id: string): Observable<Question> {
    return this.http
      .get<RawQuestion>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  create(payload: CreateQuestionPayload): Observable<Question> {
    return this.http
      .post<RawQuestion>(this.baseUrl, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  update(id: string, payload: Partial<CreateQuestionPayload>): Observable<Question> {
    return this.http
      .patch<RawQuestion>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((item) => this.normalize(item)));
  }

  delete(id: string): Observable<Question> {
    return this.http
      .delete<RawQuestion>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  private normalize(item: RawQuestion): Question {
    return {
      ...item,
      puntaje: toNumber(item.puntaje),
    };
  }
}
