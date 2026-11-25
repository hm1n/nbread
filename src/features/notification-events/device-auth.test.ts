import { describe, expect, it } from "vitest";
import { hashDeviceToken, readBearerToken } from "./device-auth";

describe("device auth", () => {
  it("Bearer 토큰만 읽는다", () => {
    expect(readBearerToken("Bearer secret-token")).toBe("secret-token");
    expect(readBearerToken("Basic secret-token")).toBeNull();
  });

  it("토큰 원문 대신 일정한 해시를 만든다", () => {
    expect(hashDeviceToken("secret-token")).toHaveLength(64);
    expect(hashDeviceToken("secret-token")).toBe(hashDeviceToken("secret-token"));
  });
});
