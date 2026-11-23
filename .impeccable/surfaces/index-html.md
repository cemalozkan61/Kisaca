---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

Scope: index.html, Kısaca ana sayfası (günlük baskı + Günün İşlemi). Mode: read (oyun bölümü operate).
Audience/job: herkes, her an; günü birkaç dakikada öğrenmek, sonra bulmacayı oynamak. Constraint: içerik Supabase'den, kaynaklar görünür, reklam yeri ileride.

## Direction contract
THESIS: Haber sitesi düzeni, Apple ürün sayfası sadeliğinde: her bölüm tek bir şeyi anlatan tam genişlik bir pano; gazete manşet ve sütun kalabalığını reddeder.
OWN-WORLD: Beyaz ve açık gri (#f5f5f7) panolar, oyun için siyah pano; tek etkileşim rengi mavi (#0066cc, koyuda #2997ff); sistem yazı tipi (SF/Segoe), sıkı başlıklar, 17px gövde; hap düğmeler, 18px köşeli kartlar, gölge yok.
STORY: Okur manşeti ve üç satırlık özeti görür, sekiz haberi kaynaklarıyla tarar, oyunu oynar, kısa kısa ve X gündemine bakar, yarın döner.
FIRST VIEWPORT: Üstte ince siyah menü, altında tarih ve "Günün İşlemi'ni oyna" hap düğmeli yapışkan şerit; ortada "Bugün" etiketi, manşet başlığı büyük, iki cümle özet, "Haberi oku" ve "Kaynak" bağlantıları; altta üç sütunlu "Vaktin yoksa" şeridi.
FORM: user-pinned: "Haber sitesi gibi olsun ama modern dokunuş istiyorum. Apple websitesi gibi sade ve neyin nerede olduğu net belli olsun"; seed: none (pinned). Reference: awesome-design-md apple/DESIGN.md (grammar only, no Apple branding).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
