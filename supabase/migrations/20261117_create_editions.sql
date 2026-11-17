create table public.editions (
  edition_date date primary key,
  data jsonb not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.editions enable row level security;
create policy "Herkes yayınlanmış baskıları okuyabilir"
  on public.editions for select to anon, authenticated using (published = true);
grant select on public.editions to anon, authenticated;
