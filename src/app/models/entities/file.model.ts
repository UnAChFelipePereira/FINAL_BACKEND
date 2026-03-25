import { EntityId } from "../common/id.type";

export interface FileEntity {
  id: EntityId;
  originalName: string;
  storedName: string;
  path: string;
  mimeType: string | null;
  extension: string | null;
  sizeBytes: string | null;
  createdAt: string;
}
