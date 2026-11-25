create extension if not exists pgcrypto with schema extensions;
create extension if not exists pgmq;

select pgmq.create('notification_events');

create type public.device_platform as enum ('android', 'ios');
create type public.device_status as enum ('active', 'revoked');
create type public.notification_event_status as enum (
  'received',
  'processing',
  'processed',
  'review_required',
  'failed'
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform public.device_platform not null,
  name text not null check (char_length(name) between 1 and 100),
  allowed_source_apps text[] not null default '{}'
    check (cardinality(allowed_source_apps) between 1 and 20),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  status public.device_status not null default 'active',
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint revoked_device_has_timestamp check (
    (status = 'revoked' and revoked_at is not null)
    or (status = 'active' and revoked_at is null)
  )
);

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete restrict,
  event_id text not null check (char_length(event_id) between 1 and 200),
  platform public.device_platform not null,
  source_app text not null check (char_length(source_app) between 1 and 200),
  source_notification_key text,
  posted_at timestamptz not null,
  captured_at timestamptz not null,
  schema_version integer not null check (schema_version > 0),
  payload jsonb not null,
  status public.notification_event_status not null default 'received',
  processing_attempts integer not null default 0 check (processing_attempts >= 0),
  last_error_code text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (device_id, event_id)
);

create index notification_events_status_created_at_idx
  on public.notification_events (status, created_at);

alter table public.devices enable row level security;
alter table public.notification_events enable row level security;

create or replace function public.enqueue_notification_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pgmq.send(
    'notification_events',
    jsonb_build_object(
      'notificationEventId', new.id,
      'schemaVersion', new.schema_version
    )
  );
  return new;
end;
$$;

create trigger enqueue_notification_event_after_insert
after insert on public.notification_events
for each row execute function public.enqueue_notification_event();

revoke all on table public.devices from anon, authenticated;
revoke all on table public.notification_events from anon, authenticated;
