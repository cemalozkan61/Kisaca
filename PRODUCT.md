# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Geniş kitle: Türkiye'de günün haberlerini hızlıca öğrenmek isteyen herkes, günün herhangi bir anında (telefonda ya da bilgisayarda). Belirli bir kullanım anı yok; tek ortak nokta vakitlerinin az olması.

## Product Purpose
Kısaca, her gün Türkiye ve dünyadan önemli haberleri kısa ve kaynaklı biçimde tek sayfada toplar ve yanında birkaç dakikalık bir günlük bulmaca (Günün İşlemi) sunar. Başarı: insanların her gün geri gelmesi.

## Positioning
- Kısalık: günü yaklaşık 5 dakikada bitirmek; her haber birkaç cümle.
- Tarafsızlık ve kaynak: yorum eklenmez, her haberin altında kaynak bağlantısı vardır.
- Günlük oyun alışkanlığı: herkes aynı gün aynı bulmacayı oynar; seri ve rekor geri gelme sebebidir.
- X gündemi: sosyal medyada konuşulanlar da aynı sayfada.

## Operating Context
- Her sabah 06.30 (TSİ) civarında yeni baskı Supabase `editions` tablosuna yazılır; site açılışta en son baskıyı okur, okuyamazsa sayfadaki yedek baskıyı gösterir.
- Günün İşlemi tarayıcıda tarihe göre üretilir, 00.00 TSİ'de yenilenir; istatistikler ziyaretçinin tarayıcısında tutulur.
- X gündemi `x_trends` tablosundan okunur; resmi X API bağlanana kadar boştur.

## Capabilities and Constraints
- Statik site (index.html + app.js) Vercel'de, veri Supabase'de; GitHub cemalozkan61/Kisaca.
- Haber JSON şeması: date, dateLabel, edition, readMin, asOf, quick[3], stories[8]{tags, title, summary, why?, note?, sources[]}, figure, briefs[].
- Oyun kuralları: 5 tek basamaklı sayı + 1 büyük sayı (10/25/50/75/100), hedef 101-699; çıkarma ve bölme büyükten küçüğe, bölme tam; tam isabet 3, ≤5 fark 2, ≤10 fark 1 yıldız; "Cevabı göster" oyunu yıldızsız bitirir, seriyi bozmaz.
- İleride reklam alanı olacak (yer ayrılmalı, şimdilik reklam yok).
- İleride telefon uygulaması da olacak.
- Üyelik konusu açık; şu an giriş yok.

## Brand Commitments
- Ad: Kısaca. Dil: Türkçe.
- Kullanıcı önceki gazete/manşet temalı tasarımları ve "yapay zekâ yapmış gibi" görünen tasarımları reddetti.

## Evidence on Hand
- Gerçek haber içeriği: Supabase `editions` (17 Kasım 2026 baskısı) ve sayfadaki yedek JSON.
- Logo, fotoğraf, kullanıcı yorumu, istatistik yok; uydurulmayacak.

## Product Principles
1. Okurun vaktine saygı: her şey kısa, gereksiz süs yok.
2. Her iddia kaynağıyla; yorum yok.
3. Her gün geri gelmeye değer küçük bir ritüel (bulmaca, seri).
4. Telefonda da masaüstündeki kadar rahat.

## Accessibility & Inclusion
Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü) tüm yazı tiplerinde doğru görünmeli; dokunma hedefleri en az 44 px; hareket azaltma tercihine uyulmalı.
