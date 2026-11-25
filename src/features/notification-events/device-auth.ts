import "server-only";
import { createHash } from "node:crypto";

export function readBearerToken(header: string | null) {
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function hashDeviceToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
