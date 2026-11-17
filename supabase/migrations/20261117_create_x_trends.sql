create table public.x_trends (
  id bigint generated always as identity primary key,
  captured_at timestamptz not null default now(),
  rank int not null,
  name text not null,
  post_count int,
  note text
);
create index x_trends_captured_idx on public.x_trends (captured_at desc, rank);
alter table public.x_trends enable row level security;
create policy "Gündem herkese okunabilir" on public.x_trends for select to anon, authenticated using (true);
grant select on public.x_trends to anon, authenticated;
