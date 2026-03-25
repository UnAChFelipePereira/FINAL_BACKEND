import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiBaseService } from "../../core/services/api-base.service";
import { FileEntity } from "../../models/entities/file.model";

export interface CreateFilePayload {
  originalName: string;
  storedName: string;
  path: string;
  mimeType: string | null;
  extension: string | null;
  sizeBytes: string | null;
}

@Injectable({
  providedIn: "root",
})
export class FilesApiService {
  private readonly baseUrl = this.apiBaseService.buildUrl("files");

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getAll(): Observable<FileEntity[]> {
    return this.http.get<FileEntity[]>(this.baseUrl);
  }

  getById(id: string): Observable<FileEntity> {
    return this.http.get<FileEntity>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateFilePayload): Observable<FileEntity> {
    return this.http.post<FileEntity>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<CreateFilePayload>): Observable<FileEntity> {
    return this.http.patch<FileEntity>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<FileEntity> {
    return this.http.delete<FileEntity>(`${this.baseUrl}/${id}`);
  }
}
