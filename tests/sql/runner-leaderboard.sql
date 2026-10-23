-- Run only against a disposable database after the runner migration. Never production.
insert into auth.users(id) values ('10000000-0000-4000-8000-000000000001'), ('10000000-0000-4000-8000-000000000002');
insert into public.game_sessions(id,user_id,started_at) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',now()-interval '10 seconds'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001',now()-interval '10 seconds'),
 ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001',now()-interval '31 minutes'),
 ('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001',now()-interval '10 seconds');
set role service_role;
select public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',100,'Player A','',62,1800);
select public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',50,'Player A','',62,1800);
do $$ begin
 assert (select best_score=100 from public.game_scores where user_id='10000000-0000-4000-8000-000000000001'), 'Score must never fall';
 begin
 perform public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',100,'A','',62,1800);
 raise exception 'Replay accepted'; exception when invalid_parameter_value then null; end;
 begin
 perform public.submit_runner_score('10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000004',100,'B','',62,1800);
 raise exception 'Other owner accepted'; exception when invalid_parameter_value then null; end;
 begin
 perform public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003',100,'A','',62,1800);
 raise exception 'Expired session accepted'; exception when invalid_parameter_value then null; end;
 begin
 perform public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',1000000,'A','',62,1800);
 raise exception 'Impossible score accepted'; exception when invalid_parameter_value then null; end;
 assert (select used_at is null from public.game_sessions where id='20000000-0000-4000-8000-000000000004'), 'Rejected score consumed session';
end $$;
select public.set_runner_privacy('10000000-0000-4000-8000-000000000001','Player A','',false);
select public.submit_runner_score('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004',150,'Player A','',62,1800);
insert into public.game_scores(user_id,display_name,avatar_url,best_score) values ('10000000-0000-4000-8000-000000000002','Player B','',90);
do $$ begin
 assert (select best_score=150 and not show_on_board from public.game_scores where user_id='10000000-0000-4000-8000-000000000001'), 'Privacy or best score overwritten';
 assert (select count(*)=1 from public.runner_board(null)), 'Hidden score leaked';
 assert (select rank is null from public.runner_board('10000000-0000-4000-8000-000000000001') where user_id='10000000-0000-4000-8000-000000000001'), 'Hidden player ranked';
end $$;
reset role;
set role anon;
do $$ begin
 assert (select count(*)=1 from (select display_name from public.game_scores) s), 'Public RLS leaked private row';
 begin perform user_id from public.game_scores; raise exception 'User IDs exposed'; exception when insufficient_privilege then null; end;
 begin perform * from public.game_sessions; raise exception 'Sessions exposed'; exception when insufficient_privilege then null; end;
 begin insert into public.game_scores(user_id,display_name) values ('10000000-0000-4000-8000-000000000002','Fake'); raise exception 'Anonymous write accepted'; exception when insufficient_privilege then null; end;
 begin perform public.submit_runner_score(null,null,0,'','',62,1800); raise exception 'Anonymous RPC allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set role authenticated;
do $$ begin
 begin update public.game_scores set best_score=99999; raise exception 'Authenticated write accepted'; exception when insufficient_privilege then null; end;
 begin perform public.runner_board(null); raise exception 'Private rank RPC allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
-- Visible current user outside top ten retains their true private rank, not array position eleven.
insert into auth.users(id) select ('30000000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid from generate_series(1,12) i;
insert into public.game_scores(user_id,display_name,best_score)
select ('30000000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid,'Fixture '||i,1000+i from generate_series(1,12) i;
set role service_role;
do $$ begin
 assert (select count(*)=10 from public.runner_board(null)), 'Public board must return ten leaders';
 assert (select count(*)=11 from public.runner_board('10000000-0000-4000-8000-000000000002')), 'Own row missing outside top ten';
 assert (select rank=13 from public.runner_board('10000000-0000-4000-8000-000000000002') where user_id='10000000-0000-4000-8000-000000000002'), 'Private rank must use all visible rows';
end $$;
reset role;
