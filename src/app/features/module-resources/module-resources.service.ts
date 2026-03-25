import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { ModuleResource } from "../../models/entities/module-resource.model";

export interface CreateModuleResourcePayload {
  moduleId: string;
  fileId: string;
  titulo: string | null;
  descripcion: string | null;
  tipoRecurso: ModuleResource["tipoRecurso"];
  orden: number;
}

@Injectable({
  providedIn: "root",
})
export class ModuleResourcesApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("module-resources");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<ModuleResource[]> {
    return this.http.get<ModuleResource[]>(this.baseUrl);
  }

  getById(id: string): Observable<ModuleResource> {
    return this.http.get<ModuleResource>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateModuleResourcePayload): Observable<ModuleResource> {
    return this.http.post<ModuleResource>(this.baseUrl, payload);
  }

  update(
    id: string,
    payload: Partial<CreateModuleResourcePayload>
  ): Observable<ModuleResource> {
    return this.http.patch<ModuleResource>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<ModuleResource> {
    return this.http.delete<ModuleResource>(`${this.baseUrl}/${id}`);
  }
}
