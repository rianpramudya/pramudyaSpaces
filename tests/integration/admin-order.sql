-- Execute as postgres in a test-capable SQL session. Every write is rolled back.
begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.owners limit 1),true);
set local role authenticated;
do $$
declare a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); c uuid:=gen_random_uuid(); before_data jsonb; swap uuid; failed boolean:=false;
begin
 if a>b then swap:=a;a:=b;b:=swap;end if;
 insert into public.entries(id,kind,title,position,published,data) values
 (a,'language','QA order A',100001,false,'{"description":"keep"}'),
 (b,'language','QA order B',100001,false,'{"level":"keep"}'),
 (c,'language','QA order C',100003,false,'{}');
 select data into before_data from public.entries where id=b;
 perform public.reorder_entry(b,'language','up');
 if (select position from public.entries where id=b)>=(select position from public.entries where id=a) then raise exception 'Up failed'; end if;
 if (select data from public.entries where id=b)<>before_data then raise exception 'Content changed'; end if;
 if (select published from public.entries where id=b) then raise exception 'Visibility changed'; end if;
 perform public.reorder_entry(b,'language','down');
 if (select position from public.entries where id=b)<=(select position from public.entries where id=a) then raise exception 'Down failed'; end if;
 begin perform public.reorder_entry(gen_random_uuid(),'language','up'); exception when others then failed:=true; end;
 if not failed then raise exception 'Missing ID allowed'; end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 failed:=false;
 begin perform public.reorder_entry(b,'language','up'); exception when others then failed:=true; end;
 if not failed then raise exception 'Visitor authorized'; end if;
end $$;
rollback;
