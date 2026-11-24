/* Kısaca: Günün Oyunları
   Her gün iki sabit oyun (Günün İşlemi, Gündem Testi) ve haftanın gününe göre değişen bir bonus. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var TZ = 3 * 3600e3, DAY = 864e5;
  var today = function () { return new Date(Date.now() + TZ).toISOString().slice(0, 10); };
  var weekday = function (d) { return new Date(d + 'T12:00:00Z').getUTCDay(); }; /* 0 = Pazar */
  var dayIndex = function (d) { return Math.round(Date.parse(d + 'T00:00:00Z') / DAY); };
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* saklama kapalı */ } }
  };
  var STAR = function (n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); };
  var norm = function (s) { return String(s).toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ0-9]/g, ''); };
  var fmt = function (n) { return Number(n).toLocaleString('tr-TR'); };

  /* ---------- bonus içerik bankası (her gün kendiliğinden döner) ---------- */
  var WORDS = [
    { c: ['Yörünge', 'Ay', 'Haberleşme'], a: 'UYDU' },
    { c: ['Pist', 'Kanat', 'Kalkış'], a: 'UÇAK' },
    { c: ['Kök', 'Gövde', 'Yaprak'], a: 'AĞAÇ' },
    { c: ['Zincir', 'Pedal', 'Gidon'], a: 'BİSİKLET' },
    { c: ['Sayfa', 'Yazar', 'Cilt'], a: 'KİTAP' },
    { c: ['Enlem', 'Boylam', 'Ölçek'], a: 'HARİTA' },
    { c: ['Tel', 'Akort', 'Pena'], a: 'GİTAR' },
    { c: ['Lav', 'Krater', 'Püskürme'], a: 'YANARDAĞ' },
    { c: ['Peron', 'Ray', 'Vagon'], a: 'TREN' },
    { c: ['Akrep', 'Yelkovan', 'Kadran'], a: 'SAAT' },
    { c: ['Piston', 'Silindir', 'Yakıt'], a: 'MOTOR' },
    { c: ['Klavye', 'İşlemci', 'Ekran'], a: 'BİLGİSAYAR' },
    { c: ['Fener', 'Liman', 'Dalga'], a: 'DENİZ' },
    { c: ['Kale', 'Penaltı', 'Hakem'], a: 'FUTBOL' }
  ];
  var ORDERS = [
    { e: [['İlk iPhone tanıtıldı', 2007], ['Curiosity Mars\'a indi', 2012], ['James Webb Teleskobu fırlatıldı', 2021]] },
    { e: [['İstanbul\'un fethi', 1453], ['Kolomb Amerika kıyılarına ulaştı', 1492], ['Fransız Devrimi', 1789]] },
    { e: [['TBMM açıldı', 1920], ['Cumhuriyet ilan edildi', 1923], ['Kadınlar milletvekili seçme ve seçilme hakkı kazandı', 1934]] },
    { e: [['İnsan Ay\'a ayak bastı', 1969], ['Berlin Duvarı yıkıldı', 1989], ['İlk web sitesi yayına girdi', 1991]] },
    { e: [['Newton\'un Principia\'sı yayımlandı', 1687], ['Darwin\'in Türlerin Kökeni yayımlandı', 1859], ['Einstein özel göreliliği yayımladı', 1905]] },
    { e: [['Titanik battı', 1912], ['Birinci Dünya Savaşı başladı', 1914], ['Lozan Antlaşması imzalandı', 1923]] },
    { e: [['Sputnik 1 fırlatıldı', 1957], ['Yuri Gagarin uzaya çıktı', 1961], ['Apollo 11 Ay\'a indi', 1969]] },
    { e: [['Euro banknotları tedavüle girdi', 2002], ['Facebook kuruldu', 2004], ['YouTube kuruldu', 2005]] },
    { e: [['Boğaziçi Köprüsü açıldı', 1973], ['Fatih Sultan Mehmet Köprüsü açıldı', 1988], ['Marmaray hizmete girdi', 2013]] },
    { e: [['Türkiye NATO\'ya katıldı', 1952], ['TRT televizyon yayınına başladı', 1968], ['İlk Türk astronot uzaya gitti', 2024]] }
  ];
  var GUESSES = [
    { q: 'Dünya ile Ay arası ortalama kaç kilometre?', a: 384400, u: 'km', i: 'Işık bu yolu yaklaşık 1,3 saniyede alır.' },
    { q: 'Everest Dağı kaç metre yüksekliğinde?', a: 8849, u: 'm', i: 'Bu değer 2020\'de Çin ve Nepal\'in ortak ölçümüyle açıklandı.' },
    { q: 'Ağrı Dağı kaç metre yüksekliğinde?', a: 5137, u: 'm', i: 'Türkiye\'nin en yüksek dağıdır.' },
    { q: 'Yetişkin bir insanın iskeletinde kaç kemik vardır?', a: 206, u: 'kemik', i: 'Yeni doğan bebeklerde bu sayı daha fazladır; bazı kemikler zamanla kaynaşır.' },
    { q: 'Dünya\'nın ekvator çevresi yaklaşık kaç kilometre?', a: 40075, u: 'km', i: 'Kutuplardan geçen çevre biraz daha kısadır; Dünya tam bir küre değildir.' },
    { q: '365 günlük bir yılda kaç saat vardır?', a: 8760, u: 'saat', i: 'Artık yıllarda 24 saat daha eklenir: 8.784.' },
    { q: 'Kızılırmak kaç kilometre uzunluğundadır?', a: 1355, u: 'km', i: 'Tamamı Türkiye sınırları içinde kalan en uzun nehirdir.' },
    { q: 'Işık bir saniyede yaklaşık kaç kilometre yol alır?', a: 299792, u: 'km', i: 'Güneş\'ten çıkan ışık Dünya\'ya yaklaşık 8 dakika 20 saniyede ulaşır.' },
    { q: 'Türkiye\'de kaç il var?', a: 81, u: 'il', i: 'Son iller Kilis, Osmaniye ve Düzce 1990\'larda kuruldu.' },
    { q: 'Bir satranç tahtasında kaç kare vardır?', a: 64, u: 'kare', i: '8 sıra ve 8 sütundan oluşur.' }
  ];
  var PAIRS = [
    { n: 'Uzay', s: ['🪐', '🌍', '🌙', '☀️', '☄️', '🚀'] },
    { n: 'Ulaşım', s: ['🚗', '🚲', '✈️', '🚢', '🚆', '🛵'] },
    { n: 'Meyveler', s: ['🍎', '🍐', '🍇', '🍋', '🍉', '🍒'] },
    { n: 'Hayvanlar', s: ['🐱', '🐶', '🦊', '🐻', '🐼', '🦉'] },
    { n: 'Spor', s: ['⚽', '🏀', '🎾', '🏐', '🏈', '⚾'] }
  ];
  /* haftanın günü → bonus oyun (Haritada Bul ve Görsel Dedektif hazır olunca yerlerine geçecek) */
  var BONUS = { 1: 'kelime', 2: 'kelime', 3: 'tahmin', 4: 'sira', 5: 'tahmin', 6: 'esini', 0: 'sira' };
  var BONUS_NAME = { kelime: 'Kelimeyi Bul', sira: 'Önce Hangisi?', tahmin: 'En Yakın Tahmin', esini: 'Eşini Bul' };
  var DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  function pick(list, d, salt) { return list[(dayIndex(d) * 7 + salt) % list.length]; }
  function shuffled(arr, seed) {
    var a = arr.slice(), s = seed >>> 0;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; var j = s % (i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var D = today();
  var KEY = function (g) { return 'kisaca:' + g + ':' + D; };

  /* ---------- sekmeler ve "bugün x/3" ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.gtab'));
  var bonusType = BONUS[weekday(D)];
  $('#gt-bonus-name').textContent = BONUS_NAME[bonusType];
  $('#pc-bonus').textContent = BONUS_NAME[bonusType];
  function show(g) {
    tabs.forEach(function (t) { var on = t.getAttribute('data-g') === g; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    ['islem', 'test', 'bonus'].forEach(function (x) { $('#g-' + x).hidden = x !== g; });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(t.getAttribute('data-g')); });
    t.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(t);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click(); }
    });
  });
  [].slice.call(document.querySelectorAll('[data-open]')).forEach(function (a) {
    a.addEventListener('click', function () { show(a.getAttribute('data-open')); });
  });
  function isDone(g) {
    if (g === 'islem') { var s = store.get('kisaca:islem:' + D); return !!(s && s.done); }
    if (g === 'test') { var dd = (window.KISACA_DATA && window.KISACA_DATA.date) || D; var q = store.get('kisaca:test:' + dd); return !!(q && q.done); }
    var r = store.get(KEY(g)); return !!(r && r.done);
  }
  function refreshDone() {
    var n = 0;
    ['islem', 'test', 'bonus'].forEach(function (g) {
      var d = isDone(g); if (d) n++;
      var t = $('.gtab[data-g="' + g + '"]'); if (t) t.classList.toggle('done', d);
      var p = $('.pc-list [data-open="' + g + '"]'); if (p) p.classList.toggle('done', d);
    });
    $('#g-count').textContent = n + '/3';
    $('#pc-count').textContent = n === 3 ? 'Bugünlük hepsi tamam' : n + '/3 tamamlandı';
  }
  document.addEventListener('kisaca:done', refreshDone);
  function done(g, rec) { rec.done = true; store.set(KEY(g), rec); refreshDone(); }

  function resultBox(stars, head, line, extra) {
    var b = el('div', 'gres');
    if (stars != null) b.appendChild(el('p', 'gstars', STAR(stars)));
    b.appendChild(el('h3', null, head));
    if (line) b.appendChild(el('p', null, line));
    if (extra) b.appendChild(extra);
    var n = el('p', 'gnext', 'Yeni oyunlar gece 00.00\'da (TSİ).');
    b.appendChild(n);
    return b;
  }

  /* ---------- Gündem Testi ---------- */
  function renderTest() {
    var box = $('#test-body'); box.innerHTML = '';
    var data = window.KISACA_DATA || {};
    var Q = data.quiz;
    if (!Q || !Q.length) { box.appendChild(el('p', 'gintro', 'Bugünün soruları sabah baskısıyla birlikte gelecek.')); return; }
    var rec = store.get('kisaca:test:' + (data.date || D)) || { picks: [], done: false };
    var key = 'kisaca:test:' + (data.date || D);
    box.appendChild(el('p', 'gintro', 'Bugünün haberlerinden ' + Q.length + ' soru. Cevaplar yukarıdaki haberlerde.'));
    Q.forEach(function (q, qi) {
      var card = el('div', 'qcard');
      card.appendChild(el('p', 'qno', (qi + 1) + '/' + Q.length));
      card.appendChild(el('h3', null, q.q));
      var opts = el('div', 'qopts');
      var picked = rec.picks[qi];
      q.options.forEach(function (o, oi) {
        var b = el('button', 'qopt', o); b.type = 'button';
        if (picked != null) {
          b.disabled = true;
          if (oi === q.answer) b.classList.add('ok');
          else if (oi === picked) b.classList.add('bad');
        }
        b.addEventListener('click', function () {
          if (rec.picks[qi] != null) return;
          rec.picks[qi] = oi;
          var all = Q.every(function (_, i) { return rec.picks[i] != null; });
          store.set(key, rec);
          if (all) { rec.done = true; store.set(key, rec); refreshDone(); }
          renderTest();
        });
        opts.appendChild(b);
      });
      card.appendChild(opts);
      if (picked != null) card.appendChild(el('p', 'qexp', (picked === q.answer ? 'Doğru. ' : 'Yanlış. ') + q.explain));
      box.appendChild(card);
    });
    if (rec.done) {
      var right = Q.filter(function (q, i) { return rec.picks[i] === q.answer; }).length;
      box.appendChild(resultBox(right, right + '/' + Q.length + ' doğru', right === Q.length ? 'Gündemi tam takip ediyorsun.' : 'Haberlere bir göz atmak iyi olabilir.'));
    }
  }

  /* ---------- Bonus: Kelimeyi Bul ---------- */
  function renderKelime(box) {
    var P = pick(WORDS, D, 1);
    var rec = store.get(KEY('bonus')) || { open: 1, tries: [], done: false, won: false };
    box.appendChild(el('p', 'gintro', 'Üç ipucu, tek kelime. Her yanlış tahminde yeni bir ipucu açılır. Üç hakkın var.'));
    var cl = el('ol', 'clues');
    P.c.forEach(function (c, i) { var li = el('li', i < rec.open || rec.done ? 'on' : '', i < rec.open || rec.done ? c : 'İpucu ' + (i + 1)); cl.appendChild(li); });
    box.appendChild(cl);
    box.appendChild(el('p', 'glen', P.a.length + ' harf'));
    if (!rec.done) {
      var f = el('form', 'gform');
      var inp = el('input'); inp.type = 'text'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', 'Tahminin'); inp.placeholder = 'Tahminini yaz';
      var b = el('button', 'btn', 'Tahmin et'); b.type = 'submit';
      f.appendChild(inp); f.appendChild(b);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var g = norm(inp.value); if (!g) return;
        rec.tries.push(inp.value.trim());
        if (g === norm(P.a)) { rec.won = true; rec.done = true; }
        else if (rec.open >= 3) { rec.done = true; }
        else rec.open += 1;
        if (rec.done) done('bonus', rec); else store.set(KEY('bonus'), rec);
        renderBonus();
      });
      box.appendChild(f);
      if (rec.tries.length) box.appendChild(el('p', 'gmsg', 'Olmadı: ' + rec.tries.join(', ')));
      setTimeout(function () { inp.focus({ preventScroll: true }); }, 0);
    } else {
      var stars = rec.won ? 4 - rec.open : 0;
      box.appendChild(resultBox(stars, rec.won ? 'Buldun: ' + P.a : 'Cevap: ' + P.a, rec.won ? rec.open + '. ipucunda bildin.' : 'Yarın yeni kelime var.'));
    }
  }

  /* ---------- Bonus: Önce Hangisi? ---------- */
  function renderSira(box) {
    var P = pick(ORDERS, D, 2);
    var rec = store.get(KEY('bonus')) || { order: shuffled([0, 1, 2], dayIndex(D) + 7).join(''), done: false };
    if (rec.order === '012' && !rec.done) rec.order = '201';
    var order = rec.order.split('').map(Number);
    box.appendChild(el('p', 'gintro', 'Olayları eskiden yeniye sırala. Okları kullan, sonra kontrol et.'));
    var ol = el('ol', 'order');
    order.forEach(function (ix, pos) {
      var li = el('li');
      var t = el('span', 'otext', P.e[ix][0]);
      li.appendChild(t);
      if (rec.done) {
        li.appendChild(el('span', 'oyear', String(P.e[ix][1])));
        li.classList.add(pos === ix ? 'ok' : 'bad');
      } else {
        var mv = el('span', 'omove');
        [['↑', -1, 'Yukarı taşı'], ['↓', 1, 'Aşağı taşı']].forEach(function (m) {
          var b = el('button', null, m[0]); b.type = 'button'; b.setAttribute('aria-label', P.e[ix][0] + ': ' + m[2]);
          var to = pos + m[1]; b.disabled = to < 0 || to > 2;
          b.addEventListener('click', function () { var o = order.slice(); var tmp = o[pos]; o[pos] = o[to]; o[to] = tmp; rec.order = o.join(''); store.set(KEY('bonus'), rec); renderBonus(); });
          mv.appendChild(b);
        });
        li.appendChild(mv);
      }
      ol.appendChild(li);
    });
    box.appendChild(ol);
    if (!rec.done) {
      var b = el('button', 'btn', 'Kontrol et'); b.type = 'button';
      b.addEventListener('click', function () { rec.done = true; done('bonus', rec); renderBonus(); });
      box.appendChild(b);
    } else {
      var right = order.filter(function (ix, pos) { return ix === pos; }).length;
      box.appendChild(resultBox(right, right === 3 ? 'Sıralama doğru' : right + '/3 yerinde', 'Doğru sıra: ' + P.e.map(function (x) { return x[0] + ' (' + x[1] + ')'; }).join(' → ')));
    }
  }

  /* ---------- Bonus: En Yakın Tahmin ---------- */
  function renderTahmin(box) {
    var P = pick(GUESSES, D, 3);
    var rec = store.get(KEY('bonus')) || { g: null, done: false };
    box.appendChild(el('p', 'gintro', 'Tek tahmin hakkın var. Puan, doğru değere ne kadar yaklaştığına göre.'));
    box.appendChild(el('h3', 'gq', P.q));
    if (!rec.done) {
      var f = el('form', 'gform');
      var inp = el('input'); inp.type = 'text'; inp.inputMode = 'numeric'; inp.autocomplete = 'off'; inp.placeholder = 'Sayı yaz (' + P.u + ')'; inp.setAttribute('aria-label', 'Tahminin, ' + P.u);
      inp.addEventListener('input', function () { var raw = inp.value.replace(/\D/g, ''); inp.value = raw ? fmt(raw) : ''; });
      var b = el('button', 'btn', 'Tahmin et'); b.type = 'submit';
      f.appendChild(inp); f.appendChild(b);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var g = Number(inp.value.replace(/\D/g, '')); if (!inp.value || isNaN(g)) return;
        rec.g = g; rec.done = true; done('bonus', rec); renderBonus();
      });
      box.appendChild(f);
    } else {
      var err = Math.abs(rec.g - P.a) / P.a;
      var stars = err <= 0.02 ? 3 : err <= 0.1 ? 2 : err <= 0.25 ? 1 : 0;
      var pct = Math.round(err * 1000) / 10;
      var bar = el('div', 'gbar');
      var fill = el('span'); fill.style.width = Math.max(4, 100 - Math.min(100, err * 100)) + '%'; bar.appendChild(fill);
      box.appendChild(resultBox(stars, 'Doğru cevap: ' + fmt(P.a) + ' ' + P.u, 'Senin tahminin ' + fmt(rec.g) + ' ' + P.u + ', fark %' + String(pct).replace('.', ',') + '. ' + P.i, bar));
    }
  }

  /* ---------- Bonus: Eşini Bul ---------- */
  function renderEsini(box) {
    var P = pick(PAIRS, D, 4);
    var rec = store.get(KEY('bonus')) || { deck: shuffled(P.s.concat(P.s), dayIndex(D) + 3), found: [], moves: 0, done: false };
    var open = [];
    box.appendChild(el('p', 'gintro', 'Tema: ' + P.n + '. 12 kartı açarak 6 çifti eşleştir.'));
    var info = el('p', 'gmsg', 'Hamle: ' + rec.moves);
    var grid = el('div', 'memo');
    rec.deck.forEach(function (s, i) {
      var b = el('button', 'mcard'); b.type = 'button';
      var up = rec.found.indexOf(i) !== -1;
      b.setAttribute('aria-label', up ? s : 'Kapalı kart ' + (i + 1));
      b.innerHTML = '<span>' + (up ? s : '') + '</span>';
      if (up) { b.classList.add('up', 'got'); b.disabled = true; }
      b.addEventListener('click', function () {
        if (rec.done || open.length === 2 || open.indexOf(i) !== -1 || rec.found.indexOf(i) !== -1) return;
        open.push(i); b.classList.add('up'); b.firstChild.textContent = s; b.setAttribute('aria-label', s);
        if (open.length === 2) {
          rec.moves += 1; info.textContent = 'Hamle: ' + rec.moves;
          var a = open[0], c = open[1];
          if (rec.deck[a] === rec.deck[c]) {
            rec.found.push(a, c); open = [];
            if (rec.found.length === 12) { rec.done = true; done('bonus', rec); setTimeout(renderBonus, 450); return; }
            store.set(KEY('bonus'), rec); setTimeout(renderBonus, 250);
          } else {
            store.set(KEY('bonus'), rec);
            setTimeout(function () { open = []; renderBonus(); }, 800);
          }
        }
      });
      grid.appendChild(b);
    });
    box.appendChild(grid);
    if (rec.done) {
      var stars = rec.moves <= 9 ? 3 : rec.moves <= 13 ? 2 : 1;
      box.appendChild(resultBox(stars, rec.moves + ' hamlede bitirdin', 'En az 6 hamlede bitebilir.'));
    } else box.appendChild(info);
  }

  function renderBonus() {
    var box = $('#bonus-body'); box.innerHTML = '';
    ({ kelime: renderKelime, sira: renderSira, tahmin: renderTahmin, esini: renderEsini })[bonusType](box);
  }

  /* haftalık bonus takvimi */
  var wk = $('#g-week');
  if (wk) [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
    var li = el('li', d === weekday(D) ? 'on' : '');
    li.appendChild(el('b', null, DAYS[d])); li.appendChild(el('span', null, BONUS_NAME[BONUS[d]]));
    wk.appendChild(li);
  });

  renderTest(); renderBonus(); refreshDone();
  document.addEventListener('kisaca:data', function () { renderTest(); refreshDone(); });
})();
