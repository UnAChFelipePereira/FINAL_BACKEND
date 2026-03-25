import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { FilesApiService } from "../../features/files/files.service";

@Injectable({
  providedIn: "root",
})
export class FileUrlResolverService {
  constructor(private filesApiService: FilesApiService) {}

  resolveImageUrl(fileIdOrPath: string | null | undefined, fallbackFileName = "perfil.jpg"): Observable<string> {
    const value = (fileIdOrPath || "").trim();

    if (!value) {
      return of(this.buildUploadsUrl(fallbackFileName));
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return of(value);
    }

    if (value.startsWith("/uploads/")) {
      return of(`${environment.apiUrl}${value}`);
    }

    return this.filesApiService.getById(value).pipe(
      map((file) => this.normalizePath(file.path, fallbackFileName)),
      catchError(() => of(this.buildUploadsUrl(fallbackFileName)))
    );
  }

  private normalizePath(path: string | null | undefined, fallbackFileName: string): string {
    const value = (path || "").trim();

    if (!value) {
      return this.buildUploadsUrl(fallbackFileName);
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    if (value.startsWith("/uploads/")) {
      return `${environment.apiUrl}${value}`;
    }

    return this.buildUploadsUrl(fallbackFileName);
  }

  private buildUploadsUrl(fileName: string): string {
    return `${environment.apiUrl}/uploads/${encodeURIComponent(fileName)}`;
  }
}
