---
name: Kısaca
reference: awesome-design-md apple/DESIGN.md yalnızca sadelik ve düzen ilkesi için; renk, yazı ve bileşenler Kısaca'nın kendi kimliği
---

# Kısaca design system

Sade, neyin nerede olduğu belli bir haber sitesi; Apple'ın sadeliğinden ilham alır ama onun görünüşünü taşımaz (kullanıcı: "Apple'a fazla benzemiş").

## Colors
- ground #f4f6f5 (hafif yeşilimsi kırık beyaz), paper #ffffff (kartlar), ink #14201f, ink-2 #3b4746, muted #5f6b6a, rule #d9dfdd
- teal #0c7c7a: İznik turkuazı, tek vurgu (bağlantı, düğme, kategori, sayaç)
- cobalt #10243a / #1a3350 / #24426a: çini laciverti, yalnızca Günün İşlemi bölümü; üstünde yazı #eef4f8 / #a9bccd, vurgu #5fd3c8
- uyarı #ffcf5a

## Typography
- Schibsted Grotesk (Google Fonts; bir haber şirketi için çizilmiş grotesk), yedek Segoe UI/system-ui.
- Manşet 36–62px/800/-0.035em; bölüm başlığı 30–42px/700, altında 2px mürekkep çizgi; kart başlığı 26px/700; liste başlığı 20px/700; gövde 17px/1.55; kategori 13px/600 turkuaz.

## Signature
- Logo "Kısaca": noktasız "ı" harfinin üstünde turkuaz kare nokta.
- Üst şeritte "x/8 okundu" sayacı: haber ekranda okununca dolar, başlığın yanına ✓ düşer.

## Layout
- Tek yapışkan şerit (logo, bölümler, okuma sayacı, "Günün İşlemi" düğmesi).
- Açılış sola dayalı: tarih, manşet, özet, düğme + kaynak; sağda "bugün üç satırda" kartı.
- Bölümler: başlık solda, açıklama sağda, altında kalın çizgi. Haberler beyaz kartlarda (2 öne çıkan + liste); oyun lacivert bantta; kısa kısa beyaz panellerde.
- Genişlik 1120px, kenar 20px.

## Shapes & depth
- Köşe 14px (kart, taş), 10px (düğme, işlem tuşu). Gölge yok; yalnızca oyun taşlarında basılan taş hissi için alt kenar.

## Do / Don't
- Her haberin altında kaynak; yorum, uydurma rakam, alıntı yok.
- Hap düğme, siyah menü, buzlu çift şerit, ortalanmış dev manşet kullanılmaz (Apple benzerliği).
- Reklam alanı ileride haberler ile oyun bölümü arasına, beyaz panel dilinde eklenecek.


## v3 (24 Kasım 2026): yeşil kaldırıldı, haberler önde, uygulama düzeni
- Zemin #f1f1ee, mürekkep #121417, tek vurgu kiremit #c8361c (açık tonu #fbe6e1). Turkuaz/yeşil hiçbir yerde yok.
- Oyun laciverti aynı (#10243a), hedef sayı ve seçili taş kehribar #ffb648.
- Kategori rozetleri: Türkiye #c8361c, Dünya #2456a6, Ekonomi #9a5b00, Spor #6b3fb0, Bilim ve Teknoloji #0f6d8c. Renk sadece rozet, kategori başlığı ve nokta için.
- Haber kartları kenarlı ve gölgeli, başlıklar büyük; liste 01, 02… numaralı, okununca numara kiremit olur.
- Telefonda alt sekme çubuğu (Bugün, Kategoriler, Oyun, Kısa kısa); manifest + service worker ile ana ekrana eklenebilir (PWA).


## v4 (24 Kasım 2026): koyu tema, Cemal'in "daybit" taslağına göre
- Zemin #0b0f0e, kart #141a18, çizgi #27312d, yazı #f3f6f1. Tek vurgu limon #c8f135 (üzerinde yazı #0b0f0e). Yazı tipi Plus Jakarta Sans 400–800.
- Logo küçük harf "kısaca" + limon nokta; başlık çubuğunun altında limon çizgi.
- Manşet büyük karanlık kart (kategori rengiyle gradyan + simge), yanında limon "Günlük Oyun" kartı ve Oyna butonu.
- Bölüm başlıkları solda limon dikey çubukla. İlk 3 haber görselli kart; kalanı içi boş limon 01, 02… numaralı liste (kırmızı taslaktaki öncelik listesi).
- Fotoğraf yok: telifsiz kaynak bulunana kadar her kategori kendi renk gradyanı ve çizgi simgesiyle gösterilir.
