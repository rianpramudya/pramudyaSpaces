alter table public.profile
 add column if not exists hero_photo text not null default '',
 add column if not exists hero_reveal_photo text not null default '',
 add column if not exists hero_photo_alt text not null default '';
