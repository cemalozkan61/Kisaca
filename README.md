# Kısaca

Günün özeti beş dakikada, yanında tek bir bulmaca: **Günün İşlemi**.

- `index.html` — tek sayfalık site (Vercel'de statik yayınlanır).
- Haberler Supabase'deki `editions` tablosundan okunur (her gün bir satır, `data` sütunu JSON).
  Okunamazsa sayfadaki yedek baskı gösterilir.
- Günün İşlemi tarayıcıda, tarihe göre üretilir; herkes aynı gün aynı bulmacayı görür, 00.00 TSİ'de yenilenir.

## Günlük baskı ekleme

```sql
insert into public.editions (edition_date, data)
values ('YYYY-MM-DD', '{...}'::jsonb)
on conflict (edition_date) do update set data = excluded.data, updated_at = now();
```

JSON alanları: `date, dateLabel, edition, readMin, asOf, quick[], stories[{tags[], title, summary, why?, note?, sources[{name,url}]}], figureAfter, figure{value, caption, source}, briefs[{tag, text, source}]`.
