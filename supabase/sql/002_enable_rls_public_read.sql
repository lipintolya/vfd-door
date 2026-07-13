-- Фикс Supabase Security Advisor: "RLS Disabled in Public"
-- Включает RLS на всех публичных таблицах каталога + разрешает только чтение
-- для anon/authenticated. Записи через эти таблицы с фронта нет — весь
-- каталог читается один раз на билде (getStaticPaths), поэтому write-policy
-- не нужна: RLS ON без неё = запись по умолчанию запрещена.
--
-- Выполнить один раз в Supabase Dashboard → SQL Editor.

alter table public.series enable row level security;
drop policy if exists "Public read access" on public.series;
create policy "Public read access" on public.series for select using (true);

alter table public.coatings enable row level security;
drop policy if exists "Public read access" on public.coatings;
create policy "Public read access" on public.coatings for select using (true);

alter table public.colors enable row level security;
drop policy if exists "Public read access" on public.colors;
create policy "Public read access" on public.colors for select using (true);

alter table public.models enable row level security;
drop policy if exists "Public read access" on public.models;
create policy "Public read access" on public.models for select using (true);

alter table public.model_colors enable row level security;
drop policy if exists "Public read access" on public.model_colors;
create policy "Public read access" on public.model_colors for select using (true);

alter table public.specifications enable row level security;
drop policy if exists "Public read access" on public.specifications;
create policy "Public read access" on public.specifications for select using (true);
