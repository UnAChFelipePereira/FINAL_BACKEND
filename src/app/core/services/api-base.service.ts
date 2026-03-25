import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiBaseService {
  readonly apiUrl = environment.apiUrl;

  buildUrl(path: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
