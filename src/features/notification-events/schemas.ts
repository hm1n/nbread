import { z } from "zod";

export const notificationEventSchema = z
  .object({
    eventId: z.string().trim().min(1).max(200),
    deviceId: z.string().uuid(),
    platform: z.enum(["android", "ios"]),
    sourceApp: z.string().trim().min(1).max(200),
    title: z.string().max(500).default(""),
    body: z.string().min(1).max(4_000),
    postedAt: z.string().datetime({ offset: true }),
    capturedAt: z.string().datetime({ offset: true }),
    schemaVersion: z.literal(1),
    sourceNotificationKey: z.string().trim().min(1).max(500).optional(),
  })
  .strict()
  .superRefine((event, context) => {
    if (new Date(event.capturedAt).getTime() + 5 * 60 * 1000 < new Date(event.postedAt).getTime()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capturedAt"],
        message: "capturedAt must not be earlier than postedAt by more than five minutes",
      });
    }
  });

export type NotificationEventInput = z.infer<typeof notificationEventSchema>;
