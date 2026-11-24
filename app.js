/* Kısaca: günün baskısı (Supabase, yoksa sayfadaki yedek) ve Günün İşlemi */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SB_URL = 'https://rhwymmgrvvudrdhnmhwk.supabase.co';
  var SB_KEY = 'sb_publishable_XxZ7ATjRIupBvnF0Fy5N6A_EQAC1Reg';

  /* ================= Haberler ================= */
  var DATA = null;
  try { DATA = JSON.parse(document.getElementById('kisaca-data').textContent); } catch (e) { DATA = null; }

  function linkTo(src) {
    var a = el('a', null, src.name);
    a.href = src.url; a.target = '_blank'; a.rel = 'noopener';
    return a;
  }
  function firstSentence(t) {
    var m = String(t).match(/^.+?[.!?](\s|$)/);
    return m ? m[0].trim() : t;
  }
  var CHEV = '<svg class="chev" viewBox="0 0 8 12" aria-hidden="true"><path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function cats(s) { return s.tags.filter(function (t) { return t !== 'Manşet'; }).join(' · '); }
  function chip(s) { var t = s.tags.filter(function (x) { return x !== 'Manşet'; }); var c = el('span', 'chip', t[0] || 'Gündem'); c.setAttribute('data-c', t[0] || ''); return c; }
  function srcLine(list) {
    var p = el('p', 'src');
    p.appendChild(document.createTextNode('Kaynak: '));
    list.forEach(function (x, j) { if (j) p.appendChild(document.createTextNode(', ')); p.appendChild(linkTo(x)); });
    return p;
  }
  var ICONS = {
    'Türkiye': '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
    'Dünya': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/>',
    'Ekonomi': '<path d="M4 19h16M6 16l4-5 3 3 5-7"/><path d="M15 7h3v3"/>',
    'Spor': '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 2.9-1.5 4.7h-5L8 10.4z"/><path d="M12 3v4.5M21 10.5l-5 0M17.5 19.5l-3-4.4M6.5 19.5l3-4.4M3 10.5h5"/>',
    'Bilim ve Teknoloji': '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
    'İklim': '<path d="M5 19c0-8 6-13 14-14-1 8-6 14-14 14z"/><path d="M5 19l7-7"/>',
    '_': '<path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h4"/>'
  };
  ICONS['Orta Doğu'] = ICONS['Ukrayna'] = ICONS['ABD'] = ICONS['Dünya'];
  ICONS['Piyasalar'] = ICONS['Ekonomi']; ICONS['Teknoloji'] = ICONS['Bilim'] = ICONS['Bilim ve Teknoloji'];
  function mainTag(s) { var t = s.tags.filter(function (x) { return x !== 'Manşet'; }); return t[0] || ''; }
  function artFor(name, cls) {
    var d = el('div', 'art' + (cls ? ' ' + cls : '')); d.setAttribute('data-c', name); d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<svg class="ico" viewBox="0 0 24 24">' + (ICONS[name] || ICONS._) + '</svg>';
    return d;
  }
  function renderNews() {
    if (!DATA) return;
    var s0 = DATA.stories[0];
    $('#hero-date').textContent = DATA.dateLabel + ' · Günün manşeti';
    $('#lead-h').textContent = s0.title;
    $('#lead-p').textContent = firstSentence(s0.summary);
    var ls = $('#lead-src'); ls.href = s0.sources[0].url;
    ls.textContent = 'Kaynak: ' + s0.sources[0].name;
    var lc = $('#lead-card'), lt = mainTag(s0);
    lc.setAttribute('data-c', lt);
    var oldIco = lc.querySelector('.ico'); if (oldIco) oldIco.remove();
    lc.insertAdjacentHTML('afterbegin', '<svg class="ico" aria-hidden="true" viewBox="0 0 24 24">' + (ICONS[lt] || ICONS._) + '</svg>');
    $('#asof').textContent = DATA.asOf;

    var q = $('#quick'); q.innerHTML = '';
    DATA.quick.forEach(function (line) { q.appendChild(el('li', null, line)); });

    var f = $('#feature'), l = $('#list');
    f.innerHTML = ''; l.innerHTML = '';
    function row(s, id) {
      var li = el('li'); li.setAttribute('data-k', s.title); li.setAttribute('data-c', mainTag(s)); if (id) li.id = id;
      var d = el('div');
      d.appendChild(chip(s));
      d.appendChild(el('h3', null, s.title));
      d.appendChild(el('p', null, s.summary));
      if (s.why) d.appendChild(el('p', 'src', s.why));
      if (s.note) d.appendChild(el('p', 'src', s.note));
      d.appendChild(srcLine(s.sources));
      li.appendChild(d);
      return li;
    }
    l.appendChild(row(s0, 's-lead'));
    DATA.stories.forEach(function (s, i) {
      if (i === 0) return;
      if (i < 4) {
        var a = el('article'); a.setAttribute('data-k', s.title); a.setAttribute('data-c', mainTag(s));
        a.appendChild(artFor(mainTag(s)));
        a.appendChild(chip(s));
        a.appendChild(el('h3', null, s.title));
        a.appendChild(el('p', null, s.summary));
        if (s.why) a.appendChild(el('p', 'why', s.why));
        a.appendChild(srcLine(s.sources));
        f.appendChild(a);
        return;
      }
      l.appendChild(row(s));
    });

    if (DATA.figure) {
      $('#fig-v').textContent = DATA.figure.value;
      var fc = $('#fig-c'); fc.innerHTML = '';
      fc.appendChild(document.createTextNode(DATA.figure.caption + ' '));
      fc.appendChild(linkTo(DATA.figure.source));
    }
    var ul = $('#briefs'); ul.innerHTML = '';
    DATA.briefs.forEach(function (x) {
      var li = el('li');
      li.appendChild(el('span', 'cat', x.tag));
      var t = el('span');
      t.appendChild(document.createTextNode(x.text + ' '));
      t.appendChild(linkTo(x.source));
      li.appendChild(t);
      ul.appendChild(li);
    });
    var cs = $('#cats'), cn = $('#cat-nav'), ks = $('#kategoriler');
    cs.innerHTML = ''; cn.innerHTML = '';
    var groups = (DATA.categories || []).filter(function (g) { return g.items && g.items.length; });
    ks.hidden = !groups.length;
    groups.forEach(function (g, gi) {
      var id = 'kat-' + gi;
      var nav = el('a', null, g.name); nav.href = '#' + id; nav.setAttribute('data-c', g.name); cn.appendChild(nav);
      var p = el('div', 'panel'); p.id = id; p.setAttribute('data-c', g.name);
      var h = el('h3', null, g.name); h.appendChild(el('small', null, g.items.length + ' haber'));
      p.appendChild(h);
      var u = el('ul');
      g.items.forEach(function (x) {
        var li = el('li');
        li.appendChild(el('h4', null, x.title));
        var t = el('p');
        t.appendChild(document.createTextNode(x.text + ' '));
        if (x.source) t.appendChild(linkTo(x.source));
        li.appendChild(t);
        u.appendChild(li);
      });
      p.appendChild(u);
      cs.appendChild(p);
    });
  }
  renderNews();
  watchReading();

  /* alt sekme çubuğu: görünen bölümü işaretle */
  (function () {
    var tabs = [].slice.call(document.querySelectorAll('.tabbar a'));
    if (!tabs.length || !('IntersectionObserver' in window)) return;
    var map = { bugun: 0, haberler: 0, kategoriler: 1, oyun: 2, kisa: 3 };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var k = map[e.target.id];
        tabs.forEach(function (t, i) { t.classList.toggle('on', i === k); if (i === k) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  })();
  (function () { var t = document.getElementById('t-num'), p = document.getElementById('pc-target'); if (t && p) { var sync = function () { p.textContent = t.textContent; }; sync(); new MutationObserver(sync).observe(t, { childList: true, characterData: true, subtree: true }); } })();
  if ('serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(function () {}); }

  /* how far you have read: a story counts once most of it has been on screen */
  function watchReading() {
    var total = DATA ? DATA.stories.length : 8, seen = {};
    var fill = $('#read-fill'), txt = $('#read-txt');
    function upd() { var n = Object.keys(seen).length; txt.textContent = n + '/' + total + ' okundu'; fill.style.width = (100 * n / total) + '%'; }
    upd();
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var k = e.target.getAttribute('data-k');
        if (k && !seen[k]) { seen[k] = 1; e.target.classList.add('read'); upd(); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-k]').forEach(function (n) { io.observe(n); });
    watchReading.io = io;
  }

  try {
    fetch(SB_URL + '/rest/v1/editions?select=edition_date,data&published=eq.true&order=edition_date.desc&limit=1', {
      headers: { apikey: SB_KEY, Accept: 'application/json' }
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (rows) {
      if (rows && rows[0] && rows[0].data && rows[0].data.stories) { DATA = rows[0].data; renderNews(); if (watchReading.io) { watchReading.io.disconnect(); } watchReading(); }
    }).catch(function () {});
  } catch (e) { /* çevrimdışı: yedek baskı */ }

  /* X gündemi: tabloda veri varsa son görüntünün ilk 8'i */
  try {
    fetch(SB_URL + '/rest/v1/x_trends?select=captured_at,rank,name,post_count&order=captured_at.desc,rank.asc&limit=20', {
      headers: { apikey: SB_KEY, Accept: 'application/json' }
    }).then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
      if (!rows || !rows.length) return;
      var latest = rows[0].captured_at, ul = $('#trends');
      ul.innerHTML = ''; $('#x-empty').hidden = true;
      rows.filter(function (x) { return x.captured_at === latest; }).slice(0, 8).forEach(function (x) {
        var li = el('li');
        li.appendChild(el('span', null, x.name + (x.post_count ? ' · ' + x.post_count.toLocaleString('tr-TR') + ' gönderi' : '')));
        ul.appendChild(li);
      });
    }).catch(function () {});
  } catch (e) { /* yok */ }

  /* ================= Günün İşlemi ================= */
  var TZ = 3 * 3600e3, DAY = 864e5, EPOCH = Date.UTC(2026, 10, 17);
  var istDate = function (off) { return new Date(Date.now() + TZ + (off || 0) * DAY).toISOString().slice(0, 10); };
  var puzzleNo = function (d) { return Math.round((Date.parse(d + 'T00:00:00Z') - EPOCH) / DAY) + 1; };
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* saklama kapalı */ } }
  };
  var fmtTime = function (ms) { var s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  var P = null, S = null, msgErr = false, popId = -1, shakeId = -1;

  function bestOf(tiles, target) {
    var b = null;
    tiles.forEach(function (t) { if (t.used) return; var d = Math.abs(t.v - target); if (!b || d < b.d) b = { v: t.v, d: d }; });
    return b;
  }
  function freshState(date) {
    P = genPuzzle(date);
    var tiles = P.nums.map(function (v, i) { return { id: i, v: v, used: false }; });
    return { date: date, no: puzzleNo(date), target: P.target, tiles: tiles, sel: null, op: null, hist: [], steps: [],
      best: bestOf(tiles, P.target), start: null, end: null, done: false, gaveUp: false, stars: 0, armed: null,
      msg: 'Bir sayı seç, sonra bir işlem, sonra ikinci sayı.' };
  }
  function save() { store.set('kisaca:islem:' + S.date, S); }
  function say(t, err) { S.msg = t; msgErr = !!err; }
  function snap() { return JSON.parse(JSON.stringify({ tiles: S.tiles, steps: S.steps })); }

  function onTile(id) {
    if (S.done) return;
    var t = S.tiles[id];
    if (!t || t.used) return;
    if (S.start == null) S.start = Date.now();
    S.armed = null;
    if (S.sel == null || S.op == null) {
      if (S.sel === id) { S.sel = null; say('Seçim kaldırıldı. Bir sayı seç.'); }
      else { S.sel = id; say(t.v + ' seçildi. Şimdi bir işlem seç.'); }
    } else if (S.sel === id) {
      S.sel = null; S.op = null; say('Seçim kaldırıldı. Bir sayı seç.');
    } else {
      var a = S.tiles[S.sel], r = combine(a.v, S.op, t.v);
      if (r.err) {
        say(r.err === 'div' ? a.v + ' ile ' + t.v + ' tam bölünmüyor. Başka bir sayı dene.' : 'Eşit iki sayının farkı sıfır olur, bu hamle geçersiz.', true);
        shakeId = id;
      } else {
        S.hist.push(snap());
        a.used = true; t.v = r.v;
        S.steps.push(r.a + ' ' + S.op + ' ' + r.b + ' = ' + r.v);
        S.op = null; S.sel = id; popId = id;
        S.best = bestOf(S.tiles, S.target);
        var last = S.steps[S.steps.length - 1];
        if (r.v === S.target) finish(false);
        else if (S.tiles.filter(function (x) { return !x.used; }).length === 1) { S.sel = null; say(last + '. Sayı kalmadı: geri al ya da en yakınla bitir.'); }
        else say(last + '. Devam et.');
      }
    }
    save(); render();
  }
  function onOp(op) {
    if (S.done) return;
    S.armed = null;
    if (S.sel == null) { say('Önce bir sayı seç.', true); render(); return; }
    S.op = S.op === op ? null : op;
    say(S.op ? S.tiles[S.sel].v + ' ' + S.op + ' … İkinci sayıyı seç.' : S.tiles[S.sel].v + ' seçili. Bir işlem seç.');
    save(); render();
  }
  function onUndo() {
    if (S.done || !S.hist.length) return;
    var h = S.hist.pop();
    S.tiles = h.tiles; S.steps = h.steps; S.sel = null; S.op = null; S.armed = null;
    S.best = bestOf(S.tiles, S.target);
    say('Son hamle geri alındı.');
    save(); render();
  }
  function onEnd() {
    if (S.done) return;
    if (S.armed !== 'end') { S.armed = 'end'; say('Tekrar dokunursan ' + S.best.v + ' ile bitirirsin (' + S.best.d + ' fark).'); render(); return; }
    if (S.start == null) S.start = Date.now();
    finish(false); save(); render();
  }
  function onReveal() {
    if (S.done) return;
    if (S.armed !== 'reveal') { S.armed = 'reveal'; say('Cevaba bakarsan bugünkü oyun biter ve yıldız alamazsın. Tekrar dokun.'); render(); return; }
    if (S.start == null) S.start = Date.now();
    finish(true); save(); render();
  }
  function finish(gaveUp) {
    S.done = true; S.end = Date.now(); S.sel = null; S.op = null; S.armed = null;
    S.gaveUp = !!gaveUp;
    S.stars = gaveUp ? 0 : starsFor(S.best.d);
    var st = store.get('kisaca:stats') || { played: 0, exact: 0, streak: 0, max: 0, last: null };
    if (st.last !== S.date) {
      st.played += 1;
      if (S.stars === 3) st.exact += 1;
      st.streak = st.last === istDate(-1) ? st.streak + 1 : 1;
      st.max = Math.max(st.max, st.streak);
      st.last = S.date;
      store.set('kisaca:stats', st);
    }
  }
  function shareText() {
    var stars = '★'.repeat(S.stars) + '☆'.repeat(3 - S.stars);
    var line = S.gaveUp ? 'Hedef ' + S.target + ' · cevaba baktım ' + stars
      : 'Hedef ' + S.target + ' → ' + S.best.v + ' ' + stars + ' (' + (S.best.d === 0 ? 'tam isabet' : S.best.d + ' fark') + ')';
    return 'Kısaca · Günün İşlemi #' + S.no + '\n' + line + '\n' + S.steps.length + ' hamle · ' + fmtTime(S.end - S.start);
  }
  function onShare() {
    var btn = $('#btn-share'), text = shareText();
    var fallback = function () { var ta = $('#share-fallback'); ta.hidden = false; ta.value = text; ta.focus(); ta.select(); btn.textContent = 'Metin seçili, kopyalayabilirsin'; };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { btn.textContent = 'Kopyalandı'; }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function render() {
    $('#g-no').textContent = '#' + S.no;
    $('#t-num').textContent = S.target;
    $('#t-best').textContent = S.best.v;
    $('#t-diff').textContent = S.best.d === 0 ? 'tam isabet' : S.best.d + ' fark';
    S.tiles.forEach(function (t, i) {
      var b = document.getElementById('tile-' + i);
      b.className = 't';
      if (t.used) { b.classList.add('used'); b.textContent = ''; b.disabled = true; b.setAttribute('aria-label', 'Kullanıldı'); b.removeAttribute('aria-pressed'); return; }
      b.disabled = S.done; b.textContent = t.v;
      b.setAttribute('aria-label', String(t.v));
      b.setAttribute('aria-pressed', S.sel === i ? 'true' : 'false');
      if (String(t.v).length > 4) b.classList.add('long');
      if (S.sel === i) b.classList.add('sel');
      if (!reduceMotion && popId === i) { void b.offsetWidth; b.classList.add('pop'); }
      if (!reduceMotion && shakeId === i) { void b.offsetWidth; b.classList.add('shake'); }
    });
    popId = -1; shakeId = -1;
    document.querySelectorAll('.op').forEach(function (b) {
      b.classList.toggle('sel', S.op === b.dataset.op);
      b.setAttribute('aria-pressed', S.op === b.dataset.op ? 'true' : 'false');
    });
    var msg = $('#msg'); msg.textContent = S.msg; msg.classList.toggle('err', msgErr);
    $('#btn-undo').disabled = !S.hist.length;
    $('#btn-end').textContent = S.armed === 'end' ? S.best.v + ' ile bitir' : 'En yakınla bitir';
    $('#btn-reveal').textContent = S.armed === 'reveal' ? 'Evet, cevabı göster' : 'Cevabı göster';
    $('#play').hidden = S.done;
    var res = $('#result'); res.hidden = !S.done;
    if (S.done) {
      $('#r-stars').textContent = S.gaveUp ? 'Cevaba baktın' : '★'.repeat(S.stars) + '☆'.repeat(3 - S.stars);
      $('#r-head').textContent = S.gaveUp ? S.target + ' böyle bulunuyor' : (S.best.d === 0 ? 'Tam isabet: ' + S.target : S.best.v + ' ile ' + S.best.d + ' farkla bitirdin');
      $('#r-line').textContent = S.gaveUp ? 'Seri bozulmadı; yarın yeni bir işlem var.' : S.steps.length + ' hamle, ' + fmtTime(S.end - S.start);
      var sol = $('#solution'); sol.innerHTML = '';
      P.steps.forEach(function (x) { sol.appendChild(el('li', null, x)); });
    }
    var st = store.get('kisaca:stats') || { played: 0, exact: 0, streak: 0, max: 0, last: null };
    var alive = st.last === istDate() || st.last === istDate(-1);
    $('#s-played').textContent = st.played;
    $('#s-exact').textContent = st.exact;
    $('#s-streak').textContent = alive ? st.streak : 0;
    $('#s-max').textContent = st.max;
    tick();
  }
  function tick() {
    if (!S) return;
    var now = Date.now();
    $('#g-time').textContent = fmtTime(S.start == null ? 0 : (S.done ? S.end : now) - S.start);
    if (S.done) {
      var left = DAY - ((now + TZ) % DAY);
      $('#next').textContent = 'Yeni işlem ' + Math.floor(left / 3600e3) + ' sa ' + String(Math.floor(left / 60e3) % 60).padStart(2, '0') + ' dk sonra.';
    }
    if (istDate() !== S.date && (S.done || S.start == null)) { S = freshState(istDate()); save(); render(); }
  }

  function start() {
    var today = istDate();
    var saved = store.get('kisaca:islem:' + today);
    P = genPuzzle(today);
    if (saved && saved.date === today && saved.target === P.target && Array.isArray(saved.tiles) && saved.tiles.length === 6) {
      S = saved; S.armed = null; if (!S.msg) S.msg = 'Bir sayı seç, sonra bir işlem, sonra ikinci sayı.';
    } else S = freshState(today);
    for (var i = 0; i < 6; i++) (function (idx) { document.getElementById('tile-' + idx).addEventListener('click', function () { onTile(idx); }); })(i);
    document.querySelectorAll('.op').forEach(function (b) { b.addEventListener('click', function () { onOp(b.dataset.op); }); });
    $('#btn-undo').addEventListener('click', onUndo);
    $('#btn-end').addEventListener('click', onEnd);
    $('#btn-reveal').addEventListener('click', onReveal);
    $('#btn-share').addEventListener('click', onShare);
    render();
    setInterval(tick, 1000);
  }
  start();
})();
