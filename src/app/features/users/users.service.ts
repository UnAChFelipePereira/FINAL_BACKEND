import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { User } from "../../models/entities/user.model";

export interface CreateUserPayload {
  email: string;
  nombre: string;
  apellido: string;
  passwordHash: string;
  rol: User["rol"];
  activo: boolean;
}

@Injectable({
  providedIn: "root",
})
export class UsersApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("users");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateUserPayload>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }
}
