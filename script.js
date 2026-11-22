/* =========================================================
   TEKA TEKI PINTAR: inti aplikasi (state, navigasi, UI umum)
   Permainan ada di games.js. Soal ada di data.js.
   ========================================================= */

const STORAGE_KEY = 'ttp_v1';

const GAME_META = {
  tts:     { title: 'Teka-Teki Silang', icon: '🔠', desc: 'Isi kotak mendatar & menurun' },
  tebak:   { title: 'Tebak Kata',       icon: '🔤', desc: 'Susun huruf dari petunjuk' },
  sambung: { title: 'Sambung Kata',     icon: '🔗', desc: 'Hubungkan huruf jadi kata' },
  quiz:    { title: 'Kuis ABCD',        icon: '🎯', desc: 'Pilihan ganda dengan timer' }
};

const START_COINS = 30;
const COIN_CORRECT = 5;
const COIN_LEVEL = 20;

/* ---------- STATE & PENYIMPANAN ---------- */
function defaultState() {
  return {
    name: 'Pemain',
    coins: START_COINS,
    done: { tts: [], tebak: [], sambung: [], quiz: [] },
    last: { game: 'tts', idx: 0 },
    stats: { correct: 0, wrong: 0, coinsEarned: 0, quizPlayed: 0, quizScoreTotal: 0, quizQuestionsTotal: 0, streak: 0, bestStreak: 0 },
    quizPerfect: false,
    history: [],
    ranking: [],
    settings: { theme: 'purple', dark: false, gridStyle: 'classic', keyboard: 'qwerty', sound: true }
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    // Gabungkan agar field baru tetap ada pada data lama
    return {
      ...base, ...parsed,
      done: { ...base.done, ...(parsed.done || {}) },
      stats: { ...base.stats, ...(parsed.stats || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
      last: { ...base.last, ...(parsed.last || {}) }
    };
  } catch (e) {
    console.warn('Gagal memuat data, memakai data baru.', e);
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Gagal menyimpan progres.', e);
  }
}

/* ---------- UTILITAS ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2000);
}

/* ---------- SUARA (WebAudio, dibuat setelah interaksi pengguna) ---------- */
let audioCtx = null;
function playCorrectSound() {
  if (!state.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [660, 880].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.18);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  } catch (e) { /* suara opsional */ }
}

function playWrongSound() {
  if (!state.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 180;
    gain.gain.value = 0.08;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) { /* suara opsional */ }
}

function confetti() {
  const colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#a855f7'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.4 + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

/* ---------- KOIN, STATISTIK, PENCAPAIAN ---------- */
function addCoins(n) {
  state.coins += n;
  if (n > 0) state.stats.coinsEarned += n;
  saveState();
  renderCoins();
}

function spendCoins(n) {
  if (state.coins < n) {
    toast(`Koin tidak cukup (butuh ${n} koin)`);
    return false;
  }
  state.coins -= n;
  saveState();
  renderCoins();
  return true;
}

function recordAnswer(isCorrect) {
  if (isCorrect) {
    state.stats.correct++;
    state.stats.streak++;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak);
    addCoins(COIN_CORRECT);
    playCorrectSound();
  } else {
    state.stats.wrong++;
    state.stats.streak = 0;
    playWrongSound();
  }
  saveState();
}

function totalLevelsDone() {
  return Object.values(state.done).reduce((sum, arr) => sum + arr.length, 0);
}

function totalLevelCount() {
  return TTS_LEVELS.length + TEBAK_LEVELS.length + SAMBUNG_LEVELS.length + QUIZ_CATEGORIES.length;
}

function checkAchievements() {
  const snapshot = {
    levelsDone: totalLevelsDone(),
    coins: state.coins,
    bestStreak: state.stats.bestStreak,
    quizPerfect: state.quizPerfect
  };
  const unlocked = [];
  ACHIEVEMENTS.forEach(a => {
    if (a.check(snapshot)) unlocked.push(a.id);
  });
  return unlocked;
}

function isAchieved(id) {
  return checkAchievements().includes(id);
}

/* ---------- NAVIGASI ---------- */
let currentView = 'home';

function showView(name, pushHistory = true) {
  $$('.view').forEach(v => v.classList.remove('active'));
  const target = $('#view-' + name);
  if (target) target.classList.add('active');
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  $('#bottom-nav').hidden = (name === 'game');
  currentView = name;
  window.scrollTo(0, 0);

  if (name === 'home') renderHome();
  if (name === 'stats') renderStats();
  if (name === 'settings') renderSettings();

  if (pushHistory) history.pushState({ view: name }, '', '#' + name);
}

window.addEventListener('popstate', (e) => {
  const view = (e.state && e.state.view) || 'home';
  if (currentView === 'game') {
    GAMES.stop();
    showView(view === 'game' ? 'home' : view, false);
  } else if (view !== currentView) {
    showView(view, false);
  }
});

/* ---------- BERANDA ---------- */
function gameProgress(game) {
  const total = levelCountFor(game);
  const done = state.done[game].length;
  return total ? Math.round((done / total) * 100) : 0;
}

function levelCountFor(game) {
  if (game === 'tts') return TTS_LEVELS.length;
  if (game === 'tebak') return TEBAK_LEVELS.length;
  if (game === 'sambung') return SAMBUNG_LEVELS.length;
  if (game === 'quiz') return QUIZ_CATEGORIES.length;
  return 0;
}

function renderHome() {
  $('#player-name').textContent = state.name || 'Pemain';
  renderCoins();
  $('#level-done').textContent = totalLevelsDone();

  const overall = Math.round((totalLevelsDone() / totalLevelCount()) * 100);
  $('#overall-percent').textContent = overall + '%';
  $('#overall-bar').style.width = overall + '%';

  const list = $('#category-list');
  list.innerHTML = Object.keys(GAME_META).map(g => {
    const m = GAME_META[g];
    const p = gameProgress(g);
    return `
      <button class="cat-card" data-game="${g}">
        <div class="cat-icon">${m.icon}</div>
        <div class="cat-name">${m.title}</div>
        <div class="cat-desc">${m.desc}</div>
        <div class="cat-bar"><div style="width:${p}%"></div></div>
        <small class="cat-desc">${state.done[g].length}/${levelCountFor(g)} level</small>
      </button>`;
  }).join('');

  $$('.cat-card', list).forEach(card => {
    card.addEventListener('click', () => openGame(card.dataset.game));
  });

  const cont = $('#btn-continue');
  const next = findNextLevel();
  cont.textContent = next ? '▶ Lanjutkan Bermain' : '🏆 Semua level selesai';
}

function renderCoins() {
  $('#coin-total').textContent = state.coins;
  const gc = $('#game-coins');
  if (gc) gc.textContent = state.coins;
}

/* Cari level berikutnya yang belum selesai, dimulai dari posisi terakhir */
function findNextLevel() {
  const order = ['tts', 'tebak', 'sambung', 'quiz'];
  const startGame = state.last.game || 'tts';
  const sequence = [startGame, ...order.filter(g => g !== startGame)];
  for (const g of sequence) {
    const count = levelCountFor(g);
    for (let i = 0; i < count; i++) {
      if (!state.done[g].includes(i) && isUnlocked(g, i)) {
        return { game: g, idx: i };
      }
    }
  }
  return null;
}

/* Level berurutan terbuka jika level sebelumnya sudah selesai. Kuis selalu terbuka. */
function isUnlocked(game, idx) {
  if (game === 'quiz') return true;
  if (idx === 0) return true;
  return state.done[game].includes(idx - 1);
}

/* ---------- DAFTAR LEVEL PER GAME ---------- */
function openGame(game) {
  GAMES.stop();
  state.last.game = game;
  saveState();
  $('#game-title').textContent = GAME_META[game].title;
  $('#game-subtitle').textContent = GAME_META[game].desc;
  $('#level-strip').hidden = true;
  $('#game-body').innerHTML = '';
  renderCoins();
  showView('game');
  history.replaceState({ view: 'game', game }, '', '#game');
  renderLevelList(game);
}

function renderLevelList(game) {
  const body = $('#game-body');
  body.classList.remove('with-kb');
  let html = '';

  if (game === 'quiz') {
    html += `<p class="muted">Pilih kategori. Waktu per soal tergantung tingkat kesulitan.</p>`;
    html += QUIZ_CATEGORIES.map(c => {
      const done = state.done.quiz.includes(QUIZ_CATEGORIES.indexOf(c));
      return levelCard(c.icon, c.name, `Kuis ${c.name}`, done, 'quiz', QUIZ_CATEGORIES.indexOf(c));
    }).join('');
  } else if (game === 'tts') {
    html += TTS_LEVELS.map((l, i) => levelCard(
      '🔠', l.title, l.cat + ' · ' + l.words.length + ' kata',
      state.done.tts.includes(i), 'tts', i, isUnlocked('tts', i)
    )).join('');
  } else if (game === 'tebak') {
    html += TEBAK_LEVELS.map((l, i) => levelCard(
      '🔤', 'Level ' + (i + 1), l.word.length + ' huruf',
      state.done.tebak.includes(i), 'tebak', i, isUnlocked('tebak', i)
    )).join('');
  } else if (game === 'sambung') {
    html += SAMBUNG_LEVELS.map((l, i) => levelCard(
      '🔗', 'Level ' + (i + 1), l.word.length + ' huruf',
      state.done.sambung.includes(i), 'sambung', i, isUnlocked('sambung', i)
    )).join('');
  }

  body.innerHTML = `<div class="level-list">${html}</div>`;
  $$('.level-card', body).forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const g = btn.dataset.game;
      const i = Number(btn.dataset.idx);
      startLevel(g, i);
    });
  });
}

function levelCard(icon, title, sub, done, game, idx, unlocked = true) {
  const status = done ? '✅ Selesai' : (unlocked ? 'Mainkan' : '🔒 Terkunci');
  return `
    <button class="card level-card" data-game="${game}" data-idx="${idx}" ${unlocked ? '' : 'disabled'}
            style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;border:none;cursor:${unlocked ? 'pointer' : 'not-allowed'};color:var(--text);opacity:${unlocked ? 1 : .5}">
      <span class="cat-icon" style="width:44px;height:44px;font-size:20px">${icon}</span>
      <span style="flex:1">
        <strong style="display:block">${escapeHtml(title)}</strong>
        <small class="muted" style="text-align:left;display:block">${escapeHtml(sub)}</small>
      </span>
      <span style="font-size:13px;font-weight:700;color:${done ? 'var(--success)' : 'var(--primary)'}">${status}</span>
    </button>`;
}

function startLevel(game, idx) {
  state.last = { game, idx };
  saveState();
  if (game === 'tts') return GAMES.tts.start(idx);
  if (game === 'tebak') return GAMES.tebak.start(idx);
  if (game === 'sambung') return GAMES.sambung.start(idx);
  if (game === 'quiz') return GAMES.quiz.chooseDifficulty(idx);
}

/* Dipanggil oleh game ketika level selesai */
function finishLevel(game, idx, info) {
  const firstTime = !state.done[game].includes(idx);
  if (firstTime) {
    state.done[game].push(idx);
    addCoins(COIN_LEVEL); // bonus koin hanya saat pertama kali selesai
  }
  state.history.unshift({
    game, title: info.title, score: info.score || 0,
    date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  });
  state.history = state.history.slice(0, 50);
  state.ranking.push({ name: state.name, title: info.title, score: info.score || 0 });
  state.ranking.sort((a, b) => b.score - a.score);
  state.ranking = state.ranking.slice(0, 10);
  saveState();
  confetti();
  renderCoins();
}

/* Kartu hasil akhir level, lengkap dengan tombol bagikan */
function showResult({ emoji, title, text, game, idx, hasNext }) {
  const body = $('#game-body');
  body.classList.remove('with-kb');
  const shareText = `Saya baru menyelesaikan "${title}" di Teka Teki Pintar! 🧩 Total ${totalLevelsDone()} level dan ${state.coins} koin. Ayo ikut asah otak!`;
  const shareUrl = 'https://wa.me/?text=' + encodeURIComponent(shareText);
  const next = hasNext ? `<button class="btn btn-primary btn-wide" id="btn-next-level">Level berikutnya ➜</button>` : '';
  body.innerHTML = `
    <div class="card result-big">
      <div class="emoji">${emoji}</div>
      <h3>${escapeHtml(title)}</h3>
      <p class="muted">${text}</p>
      ${next}
      <a class="btn btn-accent btn-wide" href="${shareUrl}" target="_blank" rel="noopener">📲 Bagikan ke WhatsApp</a>
      <button class="btn btn-secondary btn-wide" id="btn-back-list">Kembali ke daftar level</button>
    </div>`;
  $('#btn-back-list').addEventListener('click', () => renderLevelList(game));
  if (hasNext) {
    $('#btn-next-level').addEventListener('click', () => startLevel(game, idx + 1));
  }
}

/* ---------- KOMPONEN KEYBOARD VIRTUAL ---------- */
const KB_LAYOUT = {
  qwerty: [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ],
  classic: [
    ['A','B','C','D','E','F','G','H','I'],
    ['J','K','L','M','N','O','P','Q','R'],
    ['S','T','U','V','W','X','Y','Z']
  ]
};

/* Tampilkan keyboard virtual. onKey menerima 'A'..'Z', '⌫' (hapus), atau '↵' (enter). */
function showKeyboard(onKey) {
  closeKeyboard();
  const layout = state.settings.keyboard === 'classic' ? 'classic' : 'qwerty';
  const kb = document.createElement('div');
  kb.id = 'vkb';
  kb.className = 'vkb ' + layout;
  const rows = KB_LAYOUT[layout].map((row, i) => {
    const keys = row.map(k => `<button class="vkb-key" data-k="${k}">${k}</button>`).join('');
    const extra = i === KB_LAYOUT[layout].length - 1
      ? `<button class="vkb-key wide action" data-k="⌫">⌫</button>` : '';
    return `<div class="vkb-row">${keys}${extra}</div>`;
  }).join('');
  kb.innerHTML = rows;
  document.body.appendChild(kb);
  $('#game-body').classList.add('with-kb');
  kb.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.vkb-key');
    if (!btn) return;
    e.preventDefault();
    onKey(btn.dataset.k);
  });
  return kb;
}

function closeKeyboard() {
  const kb = $('#vkb');
  if (kb) kb.remove();
  const body = $('#game-body');
  if (body) body.classList.remove('with-kb');
}

/* Input dari keyboard HP / fisik, hanya saat game TTS/Tebak/Sambung aktif */
let physicalKeyHandler = null;
document.addEventListener('keydown', (e) => {
  if (currentView !== 'game' || !physicalKeyHandler) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^[a-zA-Z]$/.test(e.key)) {
    physicalKeyHandler(e.key.toUpperCase());
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    physicalKeyHandler('⌫');
    e.preventDefault();
  } else if (e.key.startsWith('Arrow')) {
    physicalKeyHandler(e.key);
    e.preventDefault();
  }
});

function setPhysicalKeyHandler(fn) { physicalKeyHandler = fn; }

/* ---------- STATISTIK ---------- */
function renderStats() {
  const s = state.stats;
  const answered = s.correct + s.wrong;
  const acc = answered ? Math.round((s.correct / answered) * 100) : 0;
  const quizAvg = s.quizPlayed ? (s.quizScoreTotal / s.quizPlayed).toFixed(1) : '0';
  $('#stats-body').innerHTML = [
    ['Level selesai', totalLevelsDone()],
    ['Total koin', state.coins],
    ['Jawaban benar', s.correct],
    ['Jawaban salah', s.wrong],
    ['Akurasi', acc + '%'],
    ['Koin didapat', s.coinsEarned],
    ['Kuis dimainkan', s.quizPlayed],
    ['Rata-rata skor kuis', quizAvg],
    ['Streak terbaik', s.bestStreak]
  ].map(([label, val]) => `<div class="stat-box"><small>${label}</small><strong>${val}</strong></div>`).join('');

  $('#achievement-list').innerHTML = ACHIEVEMENTS.map(a => {
    const ok = isAchieved(a.id);
    return `<div class="achievement ${ok ? '' : 'locked'}">
      <span class="ach-icon">${a.icon}</span>
      <div><strong>${a.name}</strong><small>${a.desc}</small></div>
      <span style="margin-left:auto">${ok ? '✅' : '🔒'}</span>
    </div>`;
  }).join('');

  $('#ranking-list').innerHTML = state.ranking.length
    ? state.ranking.map((r, i) => `<li><span>${i + 1}. ${escapeHtml(r.name)} · ${escapeHtml(r.title)}</span><strong>${r.score}</strong></li>`).join('')
    : '<li><span class="muted">Belum ada data. Mainkan level dulu!</span></li>';

  $('#history-list').innerHTML = state.history.length
    ? state.history.slice(0, 20).map(h => `<li><span>${escapeHtml(GAME_META[h.game].title)} · ${escapeHtml(h.title)}</span><small class="muted">${h.date}</small></li>`).join('')
    : '<li><span class="muted">Belum ada riwayat.</span></li>';
}

/* ---------- PENGATURAN ---------- */
function applyTheme() {
  document.body.dataset.theme = state.settings.theme;
  document.body.dataset.dark = state.settings.dark ? '1' : '0';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = state.settings.dark ? '#0f172a' : getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#7c3aed';
}

function renderSettings() {
  $('#input-name').value = state.name;

  const themeHtml = THEMES.map(t => `
    <button class="theme-swatch ${state.settings.theme === t.id && !state.settings.dark ? 'active' : ''}"
            data-theme="${t.id}" style="background:${t.color}">${t.name}</button>`).join('') + `
    <button class="theme-swatch ${state.settings.dark ? 'active' : ''}" data-dark-toggle
            style="background:#0f172a">Dark</button>`;
  $('#theme-options').innerHTML = themeHtml;

  $$('.theme-swatch[data-theme]').forEach(b => b.addEventListener('click', () => {
    state.settings.theme = b.dataset.theme;
    saveState(); applyTheme(); renderSettings();
  }));
  $('[data-dark-toggle]').addEventListener('click', () => {
    state.settings.dark = !state.settings.dark;
    saveState(); applyTheme(); renderSettings();
  });

  $$('.segmented').forEach(seg => {
    const key = seg.dataset.setting;
    $$('button', seg).forEach(b => b.classList.toggle('active', b.dataset.value === state.settings[key]));
  });
  $('#toggle-sound').checked = !!state.settings.sound;
}

function bindSettings() {
  $('#btn-save-name').addEventListener('click', () => {
    const name = $('#input-name').value.trim();
    if (!name) return toast('Nama tidak boleh kosong');
    state.name = name;
    saveState();
    toast('Nama disimpan');
  });

  $$('.segmented').forEach(seg => {
    const key = seg.dataset.setting;
    $$('button', seg).forEach(b => b.addEventListener('click', () => {
      state.settings[key] = b.dataset.value;
      saveState();
      renderSettings();
    }));
  });

  $('#toggle-sound').addEventListener('change', (e) => {
    state.settings.sound = e.target.checked;
    saveState();
  });

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Reset semua progres? Koin, level, dan statistik akan hilang.')) return;
    const keepName = state.name;
    state = defaultState();
    state.name = keepName;
    saveState();
    applyTheme();
    toast('Progres direset');
    showView('home');
  });
}

/* ---------- INISIALISASI ---------- */
function bindNav() {
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));

  $('#btn-continue').addEventListener('click', () => {
    const next = findNextLevel();
    if (!next) return toast('Kamu sudah menyelesaikan semua level!');
    startLevel(next.game, next.idx);
  });

  // Tombol kembali di header permainan
  $('[data-action="back"]').addEventListener('click', () => {
    GAMES.stop();
    showView('home');
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('SW gagal:', err));
  }
}

function init() {
  applyTheme();
  bindNav();
  bindSettings();
  registerServiceWorker();

  // Splash lalu tampilkan aplikasi
  setTimeout(() => {
    $('#splash').classList.add('hide');
    $('#app').hidden = false;
    setTimeout(() => { $('#splash').remove(); }, 450);
  }, 900);

  history.replaceState({ view: 'home' }, '', '#home');
  showView('home', false);
}

document.addEventListener('DOMContentLoaded', init);
