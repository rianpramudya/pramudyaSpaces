create or replace function public.reorder_entry(entry_id uuid, entry_kind text, move_direction text)
returns void language plpgsql security invoker set search_path='' as $$
declare current_index integer; target_index integer; total integer;
begin
 if not (select public.is_owner()) then raise exception 'Akses hanya untuk pemilik.'; end if;
 if move_direction not in ('up','down') or entry_kind not in ('project','experience','education','service','skill','certificate','achievement','language') then raise exception 'Urutan tidak valid.'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('portfolio_order:' || entry_kind));
 perform 1 from public.entries where kind=entry_kind order by position,id for update;
 with ordered as (select id, (row_number() over (order by position,id)-1)::integer as idx from public.entries where kind=entry_kind)
 select max(idx) filter (where id=entry_id),count(*) into current_index,total from ordered;
 if current_index is null then raise exception 'Konten tidak ditemukan. Muat ulang daftar.'; end if;
 target_index:=current_index+case when move_direction='up' then -1 else 1 end;
 if target_index<0 or target_index>=total then raise exception 'Konten sudah berada di batas urutan.'; end if;
 with ordered as (select id,(row_number() over (order by position,id)-1)::integer as idx from public.entries where kind=entry_kind)
 update public.entries e set position=case when o.idx=current_index then target_index when o.idx=target_index then current_index else o.idx end,updated_at=pg_catalog.now()
 from ordered o where e.id=o.id;
end;
$$;
revoke all on function public.reorder_entry(uuid,text,text) from public,anon;
grant execute on function public.reorder_entry(uuid,text,text) to authenticated;
