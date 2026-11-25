import { readBearerToken, hashDeviceToken } from "@/features/notification-events/device-auth";
import { notificationEventSchema } from "@/features/notification-events/schemas";
import { createSupabaseAdminClient } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  const token = readBearerToken(request.headers.get("authorization"));
  if (!token) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }

  const parsed = notificationEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.deviceId !== request.headers.get("x-nbread-device-id")) {
    return Response.json({ error: "device_mismatch" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: device, error: deviceError } = await supabase
    .from("devices")
    .select("id")
    .eq("id", parsed.data.deviceId)
    .eq("platform", parsed.data.platform)
    .eq("token_hash", hashDeviceToken(token))
    .eq("status", "active")
    .contains("allowed_source_apps", [parsed.data.sourceApp])
    .maybeSingle();

  if (deviceError) {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  if (!device) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: notificationEvent, error: insertError } = await supabase
    .from("notification_events")
    .insert({
      captured_at: parsed.data.capturedAt,
      device_id: device.id,
      event_id: parsed.data.eventId,
      payload: parsed.data,
      platform: parsed.data.platform,
      posted_at: parsed.data.postedAt,
      schema_version: parsed.data.schemaVersion,
      source_app: parsed.data.sourceApp,
      source_notification_key: parsed.data.sourceNotificationKey ?? null,
    })
    .select("id, status")
    .single();

  if (insertError?.code === "23505") {
    return Response.json({ accepted: true, duplicate: true }, { status: 202 });
  }

  if (insertError || !notificationEvent) {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  return Response.json(
    { accepted: true, duplicate: false, notificationEventId: notificationEvent.id },
    { status: 202 },
  );
}
