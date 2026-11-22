/* =========================================================
   LOGIKA PERMAINAN: TTS, Tebak Kata, Sambung Kata, Kuis ABCD
   Dimuat setelah data.js dan sebelum script.js.
   ========================================================= */

const GAMES = (() => {
  let timer = null;

  /* Hentikan timer, keyboard, dan input saat meninggalkan permainan */
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    setPhysicalKeyHandler(null);
    closeKeyboard();
  }

  const K = (r, c) => r + ',' + c;

  /* ---------------------------------------------------------
     MESIN TTS: menyusun kotak silang dari daftar kata
     Mengembalikan { rows, cols, cells, placements, numAt, across, down }
     --------------------------------------------------------- */
  /* Coba beberapa urutan kata dan pilih susunan yang paling banyak memuat kata */
  /* Pengacakan dengan seed tetap, agar susunan TTS selalu sama untuk level yang sama */
  function seededShuffle(arr, seed) {
    let s = seed >>> 0;
    const rnd = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildCrossword(list) {
    const base = list.map(x => ({ w: x.w.toUpperCase().replace(/\s+/g, ''), clue: x.c }));
    if (!base.length) return null;
    let seed = 0;
    for (const x of base) for (const ch of x.w) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
    const longestFirst = base.slice().sort((a, b) => b.w.length - a.w.length);
    let best = layoutOnce(longestFirst);
    for (let t = 0; t < 300 && best.unplaced.length; t++) {
      const cand = layoutOnce(seededShuffle(base, seed + t * 7919));
      if (cand.unplaced.length < best.unplaced.length) best = cand;
    }
    return best;
  }

  function layoutOnce(items) {
    const grid = new Map();         // "r,c" -> huruf
    const placements = [];          // {word, clue, r, cc, dr, dc, len}

    // Nilai > 0: jumlah perpotongan. -1: tidak valid.
    function canPlace(w, r, c, dr, dc) {
      const len = w.length;
      if (grid.has(K(r - dr, c - dc)) || grid.has(K(r + len * dr, c + len * dc))) return -1;
      let inter = 0;
      for (let i = 0; i < len; i++) {
        const rr = r + i * dr, cc = c + i * dc;
        const ex = grid.get(K(rr, cc));
        if (ex !== undefined) {
          if (ex !== w[i]) return -1;
          inter++;
        } else {
          // Sel di sisi tegak lurus harus kosong agar tidak menempel
          const pr = dc, pc = dr;
          if (grid.has(K(rr + pr, cc + pc)) || grid.has(K(rr - pr, cc - pc))) return -1;
        }
      }
      if (inter === len) return -1;     // kata duplikat yang menumpuk penuh
      return inter;
    }

    function put(item, r, c, dr, dc) {
      for (let i = 0; i < item.w.length; i++) grid.set(K(r + i * dr, c + i * dc), item.w[i]);
      placements.push({ word: item.w, clue: item.clue, r, cc: c, dr, dc, len: item.w.length });
    }

    function findBest(w) {
      let best = null;
      for (const p of placements) {
        for (let i = 0; i < p.len; i++) {
          for (let j = 0; j < w.length; j++) {
            if (w[j] !== p.word[i]) continue;
            let r, c, dr, dc;
            if (p.dr === 0) { // p mendatar -> kata baru menurun
              dr = 1; dc = 0; r = p.r - j; c = p.cc + i;
            } else {          // p menurun -> kata baru mendatar
              dr = 0; dc = 1; r = p.r + i; c = p.cc - j;
            }
            const score = canPlace(w, r, c, dr, dc);
            if (score > 0 && (!best || score > best.score)) best = { r, c, dr, dc, score };
          }
        }
      }
      return best;
    }

    // Kata pertama di tengah-kiri, sisanya menempel bergantian
    put(items[0], 0, 0, 0, 1);
    let remaining = items.slice(1);
    for (let pass = 0; pass < 6 && remaining.length; pass++) {
      const next = [];
      for (const item of remaining) {
        const best = findBest(item.w);
        if (best) put(item, best.r, best.c, best.dr, best.dc);
        else next.push(item);
      }
      remaining = next;
    }

    // Normalisasi koordinat agar mulai dari (0,0)
    let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
    for (const k of grid.keys()) {
      const [r, c] = k.split(',').map(Number);
      minR = Math.min(minR, r); maxR = Math.max(maxR, r);
      minC = Math.min(minC, c); maxC = Math.max(maxC, c);
    }
    placements.forEach(p => { p.r -= minR; p.cc -= minC; });

    const cells = new Map();        // "r,c" -> { ch, pl: [indeks placement] }
    placements.forEach((p, pi) => {
      for (let i = 0; i < p.len; i++) {
        const key = K(p.r + i * p.dr, p.cc + i * p.dc);
        if (!cells.has(key)) cells.set(key, { ch: p.word[i], pl: [] });
        cells.get(key).pl.push(pi);
      }
    });

    // Penomoran: setiap titik awal kata diberi nomor urut membaca
    const starts = [...new Set(placements.map(p => K(p.r, p.cc)))]
      .map(k => { const [r, c] = k.split(',').map(Number); return { k, r, c }; })
      .sort((a, b) => a.r - b.r || a.c - b.c);
    const numAt = new Map();
    starts.forEach((s, i) => numAt.set(s.k, i + 1));
    placements.forEach(p => { p.num = numAt.get(K(p.r, p.cc)); });

    const across = placements.map((p, i) => i).filter(i => placements[i].dr === 0)
      .sort((a, b) => placements[a].num - placements[b].num);
    const down = placements.map((p, i) => i).filter(i => placements[i].dr === 1)
      .sort((a, b) => placements[a].num - placements[b].num);

    return {
      rows: maxR - minR + 1,
      cols: maxC - minC + 1,
      cells, placements, numAt, across, down,
      unplaced: remaining.map(x => x.w)
    };
  }

  /* ---------------------------------------------------------
     TTS: permainan teka-teki silang
     --------------------------------------------------------- */
  function startTTS(idx) {
    const level = TTS_LEVELS[idx];
    const layout = buildCrossword(level.words);
    if (!layout || !layout.placements.length) {
      toast('Level ini belum bisa dimuat');
      return;
    }
    if (layout.unplaced.length) {
      console.warn('Kata tidak bisa disusun di level ini:', layout.unplaced);
    }

    const S = {
      sel: null,              // kunci kotak aktif
      dir: 'across',          // 'across' | 'down'
      user: new Map(),        // kunci -> huruf pemain
      locked: new Set(),      // kotak yang sudah benar
      bad: new Set(),         // kotak yang salah (merah)
      solved: new Set(),      // indeks placement yang sudah benar
      helps: 0
    };

    const gridStyle = state.settings.gridStyle === 'rounded' ? 'grid-rounded' : 'grid-classic';

    function activePi() {
      if (!S.sel) return null;
      const cell = layout.cells.get(S.sel);
      if (!cell) return null;
      const want = S.dir === 'across' ? 0 : 1;
      const found = cell.pl.find(pi => layout.placements[pi].dr === want);
      if (found !== undefined) return found;
      return cell.pl.length ? cell.pl[0] : null;
    }

    function cellsOf(pi) {
      const p = layout.placements[pi];
      const keys = [];
      for (let i = 0; i < p.len; i++) keys.push(K(p.r + i * p.dr, p.cc + i * p.dc));
      return keys;
    }

    function selectCell(key) {
      const cell = layout.cells.get(key);
      if (!cell) return;
      if (S.sel === key && cell.pl.length > 1) {
        S.dir = S.dir === 'across' ? 'down' : 'across';
      } else {
        const hasDir = cell.pl.some(pi => layout.placements[pi].dr === (S.dir === 'across' ? 0 : 1));
        if (!hasDir) S.dir = S.dir === 'across' ? 'down' : 'across';
      }
      S.sel = key;
      render();
    }

    function selectPlacement(pi) {
      const p = layout.placements[pi];
      S.dir = p.dr === 0 ? 'across' : 'down';
      S.sel = K(p.r, p.cc);
      render();
    }

    function moveInWord(step) {
      const pi = activePi();
      if (pi === null) return;
      const keys = cellsOf(pi);
      let i = keys.indexOf(S.sel) + step;
      while (i >= 0 && i < keys.length) {
        if (!S.locked.has(keys[i])) { S.sel = keys[i]; return; }
        i += step;
      }
    }

    function fillLetter(ch) {
      if (!S.sel) { toast('Pilih kotak dulu'); return; }
      // Kotak yang sudah benar dilewati; huruf langsung masuk ke kotak kosong berikutnya
      if (S.locked.has(S.sel)) {
        moveInWord(1);
        if (S.locked.has(S.sel)) { render(); return; }
      }
      S.user.set(S.sel, ch);
      S.bad.delete(S.sel);
      checkWords(S.sel);
      if (!S.solved.has(activePi())) moveInWord(1);
      render();
      if (S.solved.size === layout.placements.length) completeLevel();
    }

    function checkWords(key) {
      const cell = layout.cells.get(key);
      cell.pl.forEach(pi => {
        if (S.solved.has(pi)) return;
        const keys = cellsOf(pi);
        if (!keys.every(k => S.user.get(k))) return;
        const p = layout.placements[pi];
        const wrongKeys = keys.filter((k, i) => S.user.get(k) !== p.word[i]);
        if (wrongKeys.length === 0) {
          S.solved.add(pi);
          keys.forEach(k => { S.locked.add(k); S.bad.delete(k); });
          recordAnswer(true);
          toast('Benar! ✅');
        } else {
          wrongKeys.forEach(k => S.bad.add(k));
          recordAnswer(false);
          toast('Belum tepat, perbaiki kotak merah');
        }
      });
    }

    function backspace() {
      if (!S.sel) return;
      if (!S.locked.has(S.sel) && S.user.get(S.sel)) {
        S.user.delete(S.sel);
        S.bad.delete(S.sel);
      } else {
        moveInWord(-1);
        if (!S.locked.has(S.sel)) {
          S.user.delete(S.sel);
          S.bad.delete(S.sel);
        }
      }
      render();
    }

    function arrow(key) {
      if (!S.sel) return;
      const cur = S.sel.split(',').map(Number);
      const map = {
        ArrowLeft: [0, -1, 'across'], ArrowRight: [0, 1, 'across'],
        ArrowUp: [-1, 0, 'down'], ArrowDown: [1, 0, 'down']
      };
      const [dr, dc, dir] = map[key] || [0, 0, S.dir];
      const nk = K(cur[0] + dr, cur[1] + dc);
      if (layout.cells.has(nk)) {
        S.dir = dir;
        S.sel = nk;
      }
      render();
    }

    /* Bantuan: buka satu huruf (10 koin) */
    function helpReveal() {
      const pi = activePi();
      if (pi === null) { toast('Pilih kata dulu'); return; }
      const p = layout.placements[pi];
      const keys = cellsOf(pi);
      const target = keys.find(k => !S.locked.has(k) && S.user.get(k) !== p.word[keys.indexOf(k)]);
      if (!target) { toast('Kata ini sudah benar'); return; }
      if (!spendCoins(10)) return;
      S.user.set(target, p.word[keys.indexOf(target)]);
      S.bad.delete(target);
      S.helps++;
      checkWords(target);
      render();
      if (S.solved.size === layout.placements.length) completeLevel();
    }

    /* Bantuan: hapus huruf yang salah di kata aktif (5 koin) */
    function helpClearWrong() {
      const pi = activePi();
      if (pi === null) return;
      const p = layout.placements[pi];
      const keys = cellsOf(pi);
      const wrong = keys.filter((k, i) => S.user.get(k) && S.user.get(k) !== p.word[i] && !S.locked.has(k));
      if (!wrong.length) { toast('Tidak ada huruf salah di kata ini'); return; }
      if (!spendCoins(5)) return;
      wrong.forEach(k => { S.user.delete(k); S.bad.delete(k); });
      S.helps++;
      render();
    }

    /* Bantuan: petunjuk tambahan, huruf pertama kata (3 koin) */
    let hintText = '';
    function helpHint() {
      const pi = activePi();
      if (pi === null) { toast('Pilih kata dulu'); return; }
      const p = layout.placements[pi];
      if (!spendCoins(3)) return;
      hintText = `Kata ${p.num} ${p.dr === 0 ? 'mendatar' : 'menurun'}: ${p.len} huruf, diawali "${p.word[0]}"`;
      S.helps++;
      render();
    }

    function render() {
      const body = $('#game-body');
      const pi = activePi();
      const activeKeys = pi !== null ? new Set(cellsOf(pi)) : new Set();
      const total = layout.placements.length;
      const pct = Math.round((S.solved.size / total) * 100);

      let cellsHtml = '';
      for (let r = 0; r < layout.rows; r++) {
        for (let c = 0; c < layout.cols; c++) {
          const key = K(r, c);
          const cell = layout.cells.get(key);
          if (!cell) {
            cellsHtml += '<div class="cw-cell void" style="background:transparent"></div>';
            continue;
          }
          const cls = ['cw-cell'];
          if (key === S.sel) cls.push('sel');
          else if (activeKeys.has(key)) cls.push('word-hl');
          if (S.locked.has(key)) cls.push('ok');
          if (S.bad.has(key)) cls.push('bad');
          const num = layout.numAt.has(key) ? `<span class="num">${layout.numAt.get(key)}</span>` : '';
          const letter = S.user.get(key) || '';
          cellsHtml += `<div class="${cls.join(' ')}" data-key="${key}">${num}${letter}</div>`;
        }
      }

      const clueOf = (idx) => {
        const p = layout.placements[idx];
        const solved = S.solved.has(idx);
        const active = pi === idx;
        return `<div class="clue-item ${solved ? 'solved' : ''} ${active ? 'active' : ''}" data-pi="${idx}">
          <b>${p.num}.</b> ${escapeHtml(p.clue)} <small class="muted">(${p.len})</small></div>`;
      };

      const activeClue = pi !== null
        ? `<b>${layout.placements[pi].num} ${layout.placements[pi].dr === 0 ? 'Mendatar' : 'Menurun'}:</b> ${escapeHtml(layout.placements[pi].clue)}`
        : 'Ketuk kotak untuk melihat pertanyaan';

      body.innerHTML = `
        <div class="card">
          <div class="progress-thin"><div style="width:${pct}%"></div></div>
          <div class="cw-wrap ${gridStyle}">
            <div class="cw-grid" style="grid-template-columns:repeat(${layout.cols},1fr)">${cellsHtml}</div>
          </div>
        </div>
        <div class="card clue-box" id="tts-clue">${activeClue}</div>
        <div class="action-row">
          <button class="btn btn-secondary" id="tts-help-letter">💡 Buka huruf · 10</button>
          <button class="btn btn-secondary" id="tts-help-clear">🧹 Hapus salah · 5</button>
          <button class="btn btn-secondary" id="tts-help-hint">ℹ️ Petunjuk · 3</button>
        </div>
        <p class="hint-line">${escapeHtml(hintText)}</p>
        <div class="card clue-panel">
          <strong>Mendatar</strong>
          ${layout.across.map(clueOf).join('')}
          <strong>Menurun</strong>
          ${layout.down.map(clueOf).join('')}
        </div>`;

      $$('.cw-cell[data-key]', body).forEach(el => el.addEventListener('click', () => selectCell(el.dataset.key)));
      $$('.clue-item', body).forEach(el => el.addEventListener('click', () => selectPlacement(Number(el.dataset.pi))));
      $('#tts-help-letter', body).addEventListener('click', helpReveal);
      $('#tts-help-clear', body).addEventListener('click', helpClearWrong);
      $('#tts-help-hint', body).addEventListener('click', helpHint);
      $('#game-coins').textContent = state.coins;
    }

    function completeLevel() {
      stop();
      const score = Math.max(20, layout.placements.length * 10 - S.helps * 5);
      finishLevel('tts', idx, { title: level.title, score });
      showResult({
        emoji: '🏆', title: level.title,
        text: `Semua kata terjawab! Skor ${score}. Kamu dapat +20 koin bonus level.`,
        game: 'tts', idx, hasNext: idx + 1 < TTS_LEVELS.length
      });
    }

    // Keyboard virtual & fisik
    const onKey = (k) => {
      if (k === '⌫') backspace();
      else if (k.startsWith('Arrow')) arrow(k);
      else fillLetter(k);
    };
    showKeyboard(onKey);
    setPhysicalKeyHandler(onKey);
    $('#game-body').classList.add('with-kb');
    render();
  }

  /* ---------------------------------------------------------
     TEBAK KATA & SAMBUNG KATA (mekanik sama: susun huruf)
     Tebak Kata: ada huruf pengecoh. Sambung Kata: huruf persis.
     --------------------------------------------------------- */
  function startWordGame(mode, idx) {
    const isTebak = mode === 'tebak';
    const data = isTebak ? TEBAK_LEVELS[idx] : SAMBUNG_LEVELS[idx];
    const total = isTebak ? TEBAK_LEVELS.length : SAMBUNG_LEVELS.length;
    const ans = data.word.toUpperCase();
    const N = ans.length;

    // Pool huruf: huruf jawaban + pengecoh (khusus Tebak Kata)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pool = ans.split('').map(ch => ({ ch, used: false }));
    if (isTebak) {
      const extra = 3 + Math.min(3, Math.ceil(N / 3));
      for (let i = 0; i < extra; i++) {
        pool.push({ ch: alphabet[Math.floor(Math.random() * 26)], used: false });
      }
    }
    pool = shuffle(pool);

    const boxes = Array.from({ length: N }, () => ({ ch: '', src: null, fixed: false }));
    const wrongIdx = new Set();
    let hintText = '';
    let finished = false;
    let helps = 0;

    function freeBox(i) {
      const b = boxes[i];
      if (b.src !== null) pool[b.src].used = false;
      b.ch = ''; b.src = null;
    }

    function placeFromPool(pi) {
      if (pool[pi].used) return;
      const i = boxes.findIndex(b => !b.fixed && b.ch === '');
      if (i === -1) { toast('Kotak sudah penuh, hapus dulu'); return; }
      boxes[i] = { ch: pool[pi].ch, src: pi, fixed: false };
      pool[pi].used = true;
      wrongIdx.clear();
      afterChange();
    }

    function typeLetter(ch) {
      const pi = pool.findIndex(p => !p.used && p.ch === ch);
      if (pi === -1) { toast('Huruf ' + ch + ' tidak tersedia'); return; }
      placeFromPool(pi);
    }

    function removeLast() {
      for (let i = N - 1; i >= 0; i--) {
        if (boxes[i].ch && !boxes[i].fixed) { freeBox(i); break; }
      }
      wrongIdx.clear();
      render();
    }

    function tapBox(i) {
      if (boxes[i].fixed || !boxes[i].ch) return;
      freeBox(i);
      wrongIdx.clear();
      render();
    }

    function afterChange() {
      if (boxes.every(b => b.ch)) {
        const word = boxes.map(b => b.ch).join('');
        if (word === ans) {
          boxes.forEach(b => { b.fixed = true; });
          finished = true;
          recordAnswer(true);
          render();
          completeLevel();
          return;
        }
        boxes.forEach((b, i) => { if (b.ch !== ans[i]) wrongIdx.add(i); });
        recordAnswer(false);
        toast('Belum tepat, coba ubah huruf yang merah');
      }
      render();
    }

    /* Bantuan: buka satu huruf (10 koin) */
    function helpReveal() {
      const i = boxes.findIndex((b, k) => !b.fixed && b.ch !== ans[k]);
      if (i === -1) { toast('Semua huruf sudah benar'); return; }
      if (!spendCoins(10)) return;
      const need = ans[i];
      // Pastikan ada huruf yang bisa dipakai dari pool
      if (!pool.some(p => !p.used && p.ch === need)) {
        const j = boxes.findIndex((b, k) => k !== i && !b.fixed && b.ch === need);
        if (j !== -1) freeBox(j);
      }
      freeBox(i);
      const pi = pool.findIndex(p => !p.used && p.ch === need);
      if (pi !== -1) {
        pool[pi].used = true;
        boxes[i] = { ch: need, src: pi, fixed: true };
      } else {
        boxes[i] = { ch: need, src: null, fixed: true };
      }
      helps++;
      wrongIdx.delete(i);
      afterChange();
    }

    /* Bantuan: hapus huruf salah (5 koin) */
    function helpClearWrong() {
      const wrong = boxes.map((b, i) => (b.ch && !b.fixed && b.ch !== ans[i]) ? i : -1).filter(i => i !== -1);
      if (!wrong.length) { toast('Tidak ada huruf salah'); return; }
      if (!spendCoins(5)) return;
      wrong.forEach(i => freeBox(i));
      wrongIdx.clear();
      helps++;
      render();
    }

    /* Bantuan: petunjuk tambahan (3 koin) */
    function helpHint() {
      if (hintText) return;
      if (!spendCoins(3)) return;
      hintText = isTebak ? data.extra : `Huruf pertama: ${ans[0]}`;
      helps++;
      render();
    }

    function completeLevel() {
      stop();
      const score = Math.max(20, 100 - helps * 10);
      finishLevel(mode, idx, { title: `Level ${idx + 1}`, score });
      showResult({
        emoji: '🎉', title: `Level ${idx + 1}`,
        text: `Jawaban "${ans}" benar! Skor ${score}. Kamu dapat +20 koin bonus level.`,
        game: mode, idx, hasNext: idx + 1 < total
      });
    }

    function render() {
      if (finished) return;
      const body = $('#game-body');
      const boxHtml = boxes.map((b, i) => {
        const cls = ['letter-box'];
        if (b.fixed) cls.push('correct');
        if (wrongIdx.has(i)) cls.push('wrong');
        return `<div class="${cls.join(' ')}" data-box="${i}">${escapeHtml(b.ch)}</div>`;
      }).join('');
      const poolHtml = pool.map((p, pi) =>
        `<button class="pool-btn ${p.used ? 'used' : ''}" data-pool="${pi}">${p.ch}</button>`).join('');

      const clueText = isTebak ? data.hint : data.petunjuk;
      body.innerHTML = `
        <div class="card">
          <div class="clue-box">${escapeHtml(clueText)}</div>
          <div class="clue-meta">${N} huruf · ketuk huruf untuk menyusun kata</div>
          <div class="letter-row">${boxHtml}</div>
          <p class="hint-line">${escapeHtml(hintText)}</p>
          <div class="pool">${poolHtml}</div>
          <div class="action-row">
            <button class="btn btn-secondary" id="w-remove">⌫ Hapus</button>
            <button class="btn btn-secondary" id="w-help-letter">💡 Buka huruf · 10</button>
            <button class="btn btn-secondary" id="w-help-clear">🧹 Hapus salah · 5</button>
            <button class="btn btn-secondary" id="w-help-hint">ℹ️ Petunjuk · 3</button>
          </div>
        </div>`;

      $$('.pool-btn', body).forEach(b => b.addEventListener('click', () => placeFromPool(Number(b.dataset.pool))));
      $$('.letter-box', body).forEach(b => b.addEventListener('click', () => tapBox(Number(b.dataset.box))));
      $('#w-remove', body).addEventListener('click', removeLast);
      $('#w-help-letter', body).addEventListener('click', helpReveal);
      $('#w-help-clear', body).addEventListener('click', helpClearWrong);
      $('#w-help-hint', body).addEventListener('click', helpHint);
      $('#game-coins').textContent = state.coins;
    }

    const onKey = (k) => {
      if (k === '⌫') removeLast();
      else if (k.length === 1) typeLetter(k);
    };
    showKeyboard(onKey);
    setPhysicalKeyHandler(onKey);
    render();
  }

  /* ---------------------------------------------------------
     KUIS ABCD
     --------------------------------------------------------- */
  const DIFF = {
    easy:   { label: 'Mudah',  sec: 30 },
    medium: { label: 'Sedang', sec: 20 },
    hard:   { label: 'Sulit',  sec: 12 }
  };

  function chooseDifficulty(catIdx) {
    stop();
    const cat = QUIZ_CATEGORIES[catIdx];
    const count = QUIZ_QUESTIONS.filter(q => q.cat === cat.id).length;
    const body = $('#game-body');
    body.innerHTML = `
      <div class="card result-big">
        <div class="emoji">${cat.icon}</div>
        <h3>${escapeHtml(cat.name)}</h3>
        <p class="muted">${count} soal · pilih tingkat kesulitan</p>
        ${Object.entries(DIFF).map(([k, d]) =>
          `<button class="btn btn-primary btn-wide" data-diff="${k}">${d.label} · ${d.sec} detik per soal</button>`).join('')}
        <button class="btn btn-secondary btn-wide" id="quiz-back">Kembali</button>
      </div>`;
    $$('[data-diff]', body).forEach(b => b.addEventListener('click', () => startQuiz(catIdx, b.dataset.diff)));
    $('#quiz-back', body).addEventListener('click', () => renderLevelList('quiz'));
  }

  function startQuiz(catIdx, diff) {
    stop();
    const cat = QUIZ_CATEGORIES[catIdx];
    const sec = DIFF[diff].sec;
    const qs = shuffle(QUIZ_QUESTIONS.filter(q => q.cat === cat.id)).slice(0, 10).map(q => {
      const order = shuffle([0, 1, 2, 3]);
      return {
        q: q.q,
        options: order.map(i => q.options[i]),
        answer: order.indexOf(q.answer),
        explain: q.explain
      };
    });

    let cur = 0, score = 0, answered = false, remaining = sec;
    const body = $('#game-body');

    function renderQ() {
      const item = qs[cur];
      answered = false;
      remaining = sec;
      body.innerHTML = `
        <div class="quiz-top">
          <span>Soal ${cur + 1}/${qs.length}</span>
          <span class="timer-badge" id="quiz-timer">⏱ ${remaining}</span>
        </div>
        <div class="progress-thin"><div style="width:${(cur / qs.length) * 100}%"></div></div>
        <div class="card">
          <div class="clue-box">${escapeHtml(item.q)}</div>
          ${item.options.map((opt, i) => `
            <button class="option-btn" data-opt="${i}">
              <span class="opt-letter">${'ABCD'[i]}</span><span>${escapeHtml(opt)}</span>
            </button>`).join('')}
          <div id="quiz-explain"></div>
          <div id="quiz-next"></div>
        </div>`;
      $$('.option-btn', body).forEach(b => b.addEventListener('click', () => answer(Number(b.dataset.opt))));

      stop(); // hentikan timer lama; keyboard fisik tetap dipasang lagi di bawah
      setPhysicalKeyHandler(k => {
        const i = 'ABCD'.indexOf(k);
        if (i !== -1 && i < item.options.length) answer(i);
      });
      timer = setInterval(() => {
        remaining--;
        const t = $('#quiz-timer');
        if (t) t.textContent = '⏱ ' + remaining;
        if (remaining <= 0) answer(-1);
      }, 1000);
    }

    function answer(choice) {
      if (answered) return;
      answered = true;
      if (timer) { clearInterval(timer); timer = null; }
      setPhysicalKeyHandler(null);

      const item = qs[cur];
      const correct = choice === item.answer;
      if (correct) score++;
      recordAnswer(correct);

      $$('.option-btn', body).forEach((b, i) => {
        b.disabled = true;
        if (i === item.answer) b.classList.add('correct');
        else if (i === choice) b.classList.add('wrong');
      });

      const isLast = cur + 1 >= qs.length;
      $('#quiz-explain', body).innerHTML = `
        <div class="explain"><strong>${correct ? '✅ Benar!' : (choice === -1 ? '⏰ Waktu habis' : '❌ Kurang tepat')}</strong><br>${escapeHtml(item.explain)}</div>`;
      $('#quiz-next', body).innerHTML = `<button class="btn btn-primary btn-wide" id="quiz-go">${isLast ? 'Lihat hasil 🏆' : 'Soal berikutnya ➜'}</button>`;
      $('#quiz-go', body).addEventListener('click', () => {
        if (isLast) finishQuiz();
        else { cur++; renderQ(); }
      });
    }

    function finishQuiz() {
      stop();
      const total = qs.length;
      state.stats.quizPlayed++;
      state.stats.quizScoreTotal += score;
      state.stats.quizQuestionsTotal += total;
      if (score === total) state.quizPerfect = true;
      const passed = score / total >= 0.5;
      const title = `${cat.name} · ${DIFF[diff].label}`;

      if (passed) {
        finishLevel('quiz', catIdx, { title, score: score * 25 });
      } else {
        saveState();
      }
      const emoji = score === total ? '🏆' : (passed ? '👍' : '😅');
      showResult({
        emoji, title: cat.name,
        text: `Skor ${score}/${total}. ${passed ? 'Kategori ini selesai!' : 'Minimal 50% benar untuk menyelesaikan kategori. Coba lagi ya!'}`,
        game: 'quiz', idx: catIdx, hasNext: false
      });
    }

    renderQ();
  }

  return {
    stop,
    _buildCrossword: buildCrossword, // dipakai untuk pengujian otomatis
    tts: { start: startTTS },
    tebak: { start: (i) => startWordGame('tebak', i) },
    sambung: { start: (i) => startWordGame('sambung', i) },
    quiz: { chooseDifficulty }
  };
})();
