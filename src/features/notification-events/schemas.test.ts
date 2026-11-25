import { describe, expect, it } from "vitest";
import { notificationEventSchema } from "./schemas";

const validEvent = {
  eventId: "notification-42",
  deviceId: "aa793246-89d0-4e54-b58d-e2fd0139ab4f",
  platform: "android" as const,
  sourceApp: "com.example.bank",
  title: "입금",
  body: "입금 알림 예시",
  postedAt: "2026-11-25T09:00:00+09:00",
  capturedAt: "2026-11-25T09:00:01+09:00",
  schemaVersion: 1 as const,
};

describe("notificationEventSchema", () => {
  it("공통 알림 규격을 받아들인다", () => {
    expect(notificationEventSchema.safeParse(validEvent).success).toBe(true);
  });

  it("알 수 없는 필드가 섞인 알림을 거절한다", () => {
    const result = notificationEventSchema.safeParse({ ...validEvent, accountBalance: "비공개" });

    expect(result.success).toBe(false);
  });

  it("수집 시각이 게시 시각보다 크게 앞선 알림을 거절한다", () => {
    const result = notificationEventSchema.safeParse({
      ...validEvent,
      capturedAt: "2026-11-25T08:40:00+09:00",
    });

    expect(result.success).toBe(false);
  });
});
