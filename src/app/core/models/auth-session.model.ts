import { CurrentUser } from "./current-user.model";

export interface AuthSession {
  accessToken: string;
  user: CurrentUser | null;
}
