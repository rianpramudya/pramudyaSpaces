create table public.owners (
 singleton boolean primary key default true check(singleton),
 user_id uuid not null unique references auth.users(id) on delete restrict,
 created_at timestamptz not null default now()
);
alter table public.owners enable row level security;
grant select on public.owners to authenticated;
create policy owner_self on public.owners for select to authenticated using (user_id = (select auth.uid()));
create function public.is_owner() returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.owners where user_id = (select auth.uid()));
$$;
revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

create table public.profile (
 id text primary key default 'main' check(id='main'),
 section_copy jsonb not null default '{}',
 name text not null default '', wordmark text not null default '', headline text not null default '', summary text not null default '', location text not null default '',
 email text not null default '', phone text not null default '', show_email boolean not null default false, show_phone boolean not null default false,
 photo text not null default '', photo_alt text not null default '', status text not null default 'hidden' check(status in ('open','working','hidden')),
 published boolean not null default false, socials jsonb not null default '[]', featured_cv text not null default '',
 letter_recipient text not null default '', letter_role text not null default '', letter_body text not null default '',
 updated_at timestamptz not null default now()
);
insert into public.profile(id) values('main');
create table public.entries (
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('project','experience','education','service','skill','certificate','achievement','language')),
 title text not null check(char_length(title) between 1 and 240), position integer not null default 0 check(position>=0), published boolean not null default false,
 data jsonb not null default '{}', updated_at timestamptz not null default now()
);
create index entries_kind_position on public.entries(kind,position);
create table public.documents (
 id uuid primary key default gen_random_uuid(), title text not null, format text not null check(format in ('ats','creative','letter','upload')),
 path text not null unique, published boolean not null default false, source_hash text not null default '', created_at timestamptz not null default now()
);
create table public.media (
 path text primary key, name text not null, mime text not null, size integer not null, created_at timestamptz not null default now()
);
create table public.inbox (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null,
 status text not null default 'new' check(status in ('new','read','archived')), created_at timestamptz not null default now()
);
create table public.guestbook (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, avatar text not null default '', body text not null check(char_length(body) between 1 and 500),
 reply text not null default '' check(char_length(reply)<=2000), reply_updated_at timestamptz, hidden boolean not null default false,
 created_at timestamptz not null default now()
);
create index guestbook_created on public.guestbook(created_at desc);
create table public.translations (
 id text primary key, source_hash text not null, automatic jsonb not null default '{}', override jsonb, updated_at timestamptz not null default now()
);
create table public.request_limits (
 key text primary key, count integer not null default 0, expires_at timestamptz not null
);

alter table public.profile enable row level security;
alter table public.entries enable row level security;
alter table public.documents enable row level security;
alter table public.media enable row level security;
alter table public.inbox enable row level security;
alter table public.guestbook enable row level security;
alter table public.translations enable row level security;
alter table public.request_limits enable row level security;

grant select,insert,update,delete on public.profile,public.entries,public.documents,public.media,public.inbox,public.guestbook,public.translations to authenticated;
-- Guestbook visitors read the server projection; no direct anon table access.
grant all on public.owners,public.profile,public.entries,public.documents,public.media,public.inbox,public.guestbook,public.translations,public.request_limits to service_role;
create policy owner_profile on public.profile for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_entries on public.entries for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_documents on public.documents for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_media on public.media for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_inbox on public.inbox for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_guestbook on public.guestbook for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
-- Authenticated visitors also have no direct read policy; server exposes public fields only.
create policy owner_translations on public.translations for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
-- No visitor write policy: server routes verify OAuth, validate and rate-limit writes.

create function public.consume_limit(limit_key text, maximum integer, window_seconds integer) returns boolean
 language plpgsql security invoker set search_path='' as $$
 declare current_count integer;
 begin
  delete from public.request_limits where expires_at < now() - interval '1 day';
  insert into public.request_limits(key,count,expires_at) values(limit_key,1,now()+make_interval(secs=>window_seconds))
  on conflict(key) do update set
   count=case when public.request_limits.expires_at<=now() then 1 else public.request_limits.count+1 end,
   expires_at=case when public.request_limits.expires_at<=now() then now()+make_interval(secs=>window_seconds) else public.request_limits.expires_at end
  returning count into current_count;
  return current_count<=maximum;
 end;
$$;
revoke all on function public.consume_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_limit(text,integer,integer) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('portfolio','portfolio',false,10485760,array['image/jpeg','image/png','image/webp','application/pdf'])
 on conflict(id) do nothing;
create policy owner_storage_read on storage.objects for select to authenticated using(bucket_id='portfolio' and (select public.is_owner()));
create policy owner_storage_insert on storage.objects for insert to authenticated with check(bucket_id='portfolio' and (select public.is_owner()));
create policy owner_storage_update on storage.objects for update to authenticated using(bucket_id='portfolio' and (select public.is_owner())) with check(bucket_id='portfolio' and (select public.is_owner()));
create policy owner_storage_delete on storage.objects for delete to authenticated using(bucket_id='portfolio' and (select public.is_owner()));

create function public.cache_translation(translation_id text,translation_hash text,translation_auto jsonb) returns void
 language sql security invoker set search_path='' as $$
 insert into public.translations(id,source_hash,automatic,override,updated_at) values(translation_id,translation_hash,translation_auto,null,now())
 on conflict(id) do update set source_hash=excluded.source_hash,automatic=excluded.automatic,
 override=case when public.translations.source_hash=excluded.source_hash then public.translations.override else null end,updated_at=now();
$$;
revoke all on function public.cache_translation(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.cache_translation(text,text,jsonb) to service_role;
