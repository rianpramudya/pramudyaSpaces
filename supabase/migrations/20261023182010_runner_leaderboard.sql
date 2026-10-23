-- Runner writes are service-only. Apply manually after review; no existing tables changed.
begin;
create table if not exists public.game_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  avatar_url text not null default '' check (char_length(avatar_url) <= 2000),
  best_score integer not null default 0 check (best_score between 0 and 1000000),
  show_on_board boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  used_at timestamptz
);
create index if not exists game_scores_visible_rank on public.game_scores (best_score desc, updated_at, user_id) where show_on_board;
create index if not exists game_sessions_user_started on public.game_sessions (user_id, started_at);
alter table public.game_scores enable row level security;
alter table public.game_sessions enable row level security;
revoke all on public.game_scores, public.game_sessions from public, anon, authenticated;
grant all on public.game_scores, public.game_sessions to service_role;
-- Column grants prevent direct Data API clients from reading user_id or opt-out rows.
grant select (display_name, avatar_url, best_score) on public.game_scores to anon, authenticated;
drop policy if exists game_scores_public_read on public.game_scores;
create policy game_scores_public_read on public.game_scores for select to anon, authenticated using (show_on_board);
-- No client write policies and no client session access.

create or replace function public.submit_runner_score(
  p_user_id uuid, p_session uuid, p_score integer, p_name text, p_avatar text,
  p_max_rate double precision, p_session_seconds integer
) returns integer language plpgsql security invoker set search_path = '' as $$
declare
  game public.game_sessions%rowtype;
  duration double precision;
  result integer;
begin
  select * into game from public.game_sessions where id = p_session and user_id = p_user_id for update;
  if not found or game.used_at is not null then raise exception 'Invalid game session' using errcode = '22023'; end if;
  duration := extract(epoch from (clock_timestamp() - game.started_at));
  if p_score is null or p_score < 0 or p_score > 1000000 or p_max_rate is null or p_max_rate <= 0
     or p_session_seconds is null or p_session_seconds <= 0 or duration < 0 or duration > p_session_seconds
     or p_score > floor(duration * p_max_rate) then
    raise exception 'Invalid game score' using errcode = '22023';
  end if;
  update public.game_sessions set used_at = clock_timestamp() where id = p_session;
  insert into public.game_scores as scores (user_id, display_name, avatar_url, best_score)
    values (p_user_id, p_name, p_avatar, p_score)
    on conflict (user_id) do update set
      best_score = greatest(scores.best_score, excluded.best_score),
      display_name = excluded.display_name, avatar_url = excluded.avatar_url,
      updated_at = case when excluded.best_score > scores.best_score then clock_timestamp() else scores.updated_at end
    returning best_score into result;
  -- Opt-out is deliberately untouched, even when score and privacy requests race.
  return result;
end;
$$;
revoke all on function public.submit_runner_score(uuid,uuid,integer,text,text,double precision,integer) from public, anon, authenticated;
grant execute on function public.submit_runner_score(uuid,uuid,integer,text,text,double precision,integer) to service_role;

-- Service-only projection query: return ten leaders plus the caller's own row for private API projection.
create or replace function public.runner_board(p_user_id uuid)
returns table(user_id uuid, display_name text, avatar_url text, best_score integer, show_on_board boolean, rank bigint)
language sql stable security invoker set search_path = '' as $$
  with ranked as (
    select s.*, row_number() over (order by s.best_score desc, s.updated_at, s.user_id) as position
    from public.game_scores s where s.show_on_board
  ), selected as (
    select r.user_id, r.display_name, r.avatar_url, r.best_score, r.show_on_board, r.position
    from ranked r where r.position <= 10 or r.user_id = p_user_id
    union all
    select s.user_id, s.display_name, s.avatar_url, s.best_score, s.show_on_board, null::bigint
    from public.game_scores s where s.user_id = p_user_id and not s.show_on_board
  ) select * from selected order by position nulls last;
$$;
revoke all on function public.runner_board(uuid) from public, anon, authenticated;
grant execute on function public.runner_board(uuid) to service_role;
create or replace function public.set_runner_privacy(p_user_id uuid, p_name text, p_avatar text, p_visible boolean)
returns void language sql security invoker set search_path = '' as $$
  insert into public.game_scores as scores (user_id, display_name, avatar_url, show_on_board)
  values (p_user_id, p_name, p_avatar, p_visible)
  on conflict (user_id) do update set display_name=excluded.display_name,
    avatar_url=excluded.avatar_url, show_on_board=excluded.show_on_board;
$$;
revoke all on function public.set_runner_privacy(uuid,text,text,boolean) from public, anon, authenticated;
grant execute on function public.set_runner_privacy(uuid,text,text,boolean) to service_role;
commit;
