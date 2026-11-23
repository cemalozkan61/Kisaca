---
name: Kısaca
reference: awesome-design-md apple/DESIGN.md (grammar only; no Apple branding)
---

# Kısaca design system

Haber sitesi düzeni, Apple ürün sayfası sadeliğinde. Her bölüm tek bir şeyi anlatan tam genişlik bir pano; panolar arasındaki renk değişimi ayraçtır.

## Colors
- canvas #ffffff, parchment #f5f5f7 (alternatif pano), ink #1d1d1f, ink-2 #424245, muted #6e6e73, hairline #d2d2d7
- action #0066cc: tek etkileşim rengi (bağlantı, hap düğme, odak); koyu panoda #2997ff
- koyu pano #000000, yüzeyler #1d1d1f / #2c2c2e, yazı #f5f5f7, ikincil #a1a1a6; uyarı mesajı #ffd60a
- İkinci bir vurgu rengi yok; dekoratif degrade yok.

## Typography
- Sistem yazı tipi yığını (SF Pro, Segoe UI, Roboto…); Türkçe karakterler hepsinde tam.
- Manşet 36–64px/600/-0.025em; pano başlığı 32–48px/600; kart başlığı 28px; liste başlığı 21px; gövde 17px/1.47/-0.022em; ikincil 14–15px; menü 12px.
- Ağırlıklar 400 ve 600; 500 yok.

## Layout
- İçerik genişliği 1024px, kenar boşluğu en az 22px. Pano dolgusu 88px (telefonda 64px).
- Üstte 44px siyah menü, altında 52px yapışkan tarih şeridi ve mavi hap düğme.
- Sıra: manşet + üç satır özet → beyaz kartlarda iki öne çıkan haber + çizgili liste → siyah oyun panosu → açık gri "Kısa kısa" (cümleler, günün sayısı, X gündemi) → dipnot.

## Shapes & depth
- Köşe: 18px kart/pano, 12px küçük yüzey, hap (980px) düğme ve işlem tuşları. Gölge yok.

## Components
- Hap düğme: mavi zemin, beyaz yazı, basınca scale(.95).
- Metin bağlantısı: mavi, çizgili SVG ok ile.
- Oyun taşı: #2c2c2e zemin, 36px/600 rakam, seçili #2997ff; kullanılmış taş içi boş çerçeve.
- İşlem tuşları: SVG simgeli koyu haplar; seçili beyaz.

## Motion
- Tek dil: cubic-bezier(.16,1,.3,1); taş birleşince küçük "pop", geçersiz hamlede sallanma; hareket azaltma tercihinde hepsi kapalı.

## Do / Don't
- Her haberin altında kaynak. Yorum yok. Uydurma rakam, yorum, kullanıcı alıntısı yok.
- Kategori etiketleri gri ve küçük; başlık üstünde süs etiketi yok.
- Reklam alanı ileride "Kısa kısa" panosu ile oyun panosu arasına, aynı pano dilinde eklenecek.
