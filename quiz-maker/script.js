/* ============================================
   ChalkQuiz — app logic
   All data lives in localStorage. No backend.
   Keys:
     qm_users     -> { username: password }
     qm_session   -> username of logged-in user (or null)
     qm_quizzes   -> [{ id, title, author, questions:[{text, options:[4], correct}] }]
     qm_results   -> [{ id, quizId, quizTitle, user, score, total, date, answers:[{qText, options, correct, picked}] }]
   ============================================ */

const STORAGE = {
  users: 'qm_users',
  session: 'qm_session',
  quizzes: 'qm_quizzes',
  results: 'qm_results',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- App state ---------- */

const state = {
  currentUser: readJSON(STORAGE.session, null),
  takeQuiz: null,        // the quiz currently being taken
  takeIndex: 0,           // current question index
  takeAnswers: [],        // picked option index per question (-1 = unanswered)
  takeLocked: [],          // whether each question has been answered/timed out (shows feedback, stops interaction)
  timerInterval: null,    // handle for the per-question countdown
  advanceTimeout: null,    // handle for the delayed auto-advance after a timeout
  timeLeft: 0,             // seconds left on the current question
  lastResult: null,        // most recently finished quiz's result, for the share card
};

/* ---------- Navigation ---------- */

const views = ['auth', 'home', 'create', 'browse', 'take', 'results', 'leaderboard'];

function showView(name) {
  clearQuestionTimer();
  views.forEach(v => {
    document.getElementById('view-' + v).classList.toggle('hidden', v !== name);
  });
  window.scrollTo({ top: 0, behavior: 'auto' });

  if (name === 'home') renderHome();
  if (name === 'create') renderCreateForm();
  if (name === 'browse') renderBrowse();
}

function requireAuthThen(name) {
  if (!state.currentUser && name !== 'auth') {
    showView('auth');
    return;
  }
  showView(name);
}

document.addEventListener('click', (e) => {
  const navTarget = e.target.closest('[data-nav]');
  if (navTarget) {
    requireAuthThen(navTarget.dataset.nav);
  }
});

/* ---------- Auth ---------- */

const topnav = document.getElementById('topnav');
const navUser = document.getElementById('navUser');

function refreshAuthUI() {
  if (state.currentUser) {
    topnav.hidden = false;
    navUser.textContent = '@' + state.currentUser;
  } else {
    topnav.hidden = true;
  }
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isLogin = tab.dataset.tab === 'login';
    document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
    document.getElementById('signupForm').classList.toggle('hidden', isLogin);
  });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = readJSON(STORAGE.users, {});
  const errorEl = document.getElementById('loginError');

  if (!users[username] || users[username] !== password) {
    errorEl.textContent = 'That username and password don\u2019t match.';
    return;
  }
  errorEl.textContent = '';
  logIn(username);
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errorEl = document.getElementById('signupError');
  const users = readJSON(STORAGE.users, {});

  if (username.length < 2) {
    errorEl.textContent = 'Username needs at least 2 characters.';
    return;
  }
  if (users[username]) {
    errorEl.textContent = 'That username is taken. Try logging in instead.';
    return;
  }
  errorEl.textContent = '';
  users[username] = password;
  writeJSON(STORAGE.users, users);
  logIn(username);
});

function logIn(username) {
  state.currentUser = username;
  writeJSON(STORAGE.session, username);
  refreshAuthUI();
  document.getElementById('loginForm').reset();
  document.getElementById('signupForm').reset();
  showView('home');
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  state.currentUser = null;
  localStorage.removeItem(STORAGE.session);
  refreshAuthUI();
  showView('auth');
});

/* ---------- Theme ---------- */

const themeToggle = document.getElementById('themeToggle');

function applyThemeIcon() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.textContent = isLight ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('qm_theme', next);
  applyThemeIcon();
});

applyThemeIcon();

/* ---------- Home ---------- */

function renderHome() {
  document.getElementById('homeGreeting').textContent = 'Welcome back, ' + state.currentUser;

  const results = readJSON(STORAGE.results, {})[state.currentUser] || [];
  const strip = document.getElementById('recentResults');
  strip.innerHTML = '';

  renderAchievements();

  if (results.length === 0) {
    strip.innerHTML = '<p class="empty-hint">No quizzes taken yet — go pick one from the shelf.</p>';
    return;
  }

  results.slice(-6).reverse().forEach(r => {
    const chip = document.createElement('div');
    chip.className = 'result-chip';
    chip.innerHTML = `
      <div class="rc-title">${escapeHTML(r.quizTitle)}</div>
      <div class="rc-score">${r.score}/${r.total}</div>
    `;
    strip.appendChild(chip);
  });
}

function computeAchievements(user) {
  const results = readJSON(STORAGE.results, {})[user] || [];
  const quizzes = readJSON(STORAGE.quizzes, []);
  const categoryById = {};
  quizzes.forEach(q => { categoryById[q.id] = q.category; });

  const totalAttempts = results.length;
  const hasPerfect = results.some(r => r.total > 0 && r.score === r.total);
  const highScoreCount = results.filter(r => r.total > 0 && (r.score / r.total) >= 0.8).length;
  const categoriesTried = new Set(results.map(r => categoryById[r.quizId]).filter(Boolean));

  return [
    { icon: '🎉', label: 'First Steps', desc: 'Complete your first quiz.', earned: totalAttempts >= 1 },
    { icon: '🎯', label: 'Perfectionist', desc: 'Score 100% on any quiz.', earned: hasPerfect },
    { icon: '📚', label: 'Quiz Master', desc: 'Complete 5 quizzes.', earned: totalAttempts >= 5 },
    { icon: '🔥', label: 'On a Roll', desc: 'Score 80%+ on 3 quizzes.', earned: highScoreCount >= 3 },
    { icon: '🌍', label: 'Explorer', desc: 'Try quizzes from 3 different categories.', earned: categoriesTried.size >= 3 },
  ];
}

function renderAchievements() {
  const list = document.getElementById('achievementsList');
  list.innerHTML = '';
  computeAchievements(state.currentUser).forEach(a => {
    const chip = document.createElement('div');
    chip.className = 'achievement-chip' + (a.earned ? ' earned' : '');
    chip.title = a.desc;
    chip.innerHTML = `<span class="ach-icon">${a.earned ? a.icon : '🔒'}</span><span class="ach-label">${escapeHTML(a.label)}</span>`;
    list.appendChild(chip);
  });
}

/* ---------- Create quiz ---------- */

const questionList = document.getElementById('questionList');
let qBlockCount = 0;

function makeQuestionBlock() {
  qBlockCount += 1;
  const blockId = uid();
  const wrap = document.createElement('div');
  wrap.className = 'question-block';
  wrap.dataset.blockId = blockId;
  wrap.innerHTML = `
    <div class="question-block-head">
      <span>Question ${qBlockCount}</span>
      <button type="button" class="remove-q-btn">Remove</button>
    </div>
    <label>Question text
      <input type="text" class="q-text-input" placeholder="e.g. What year did India gain independence?" required>
    </label>
    ${[0, 1, 2, 3].map(i => `
      <div class="option-row">
        <input type="radio" name="correct-${blockId}" value="${i}" ${i === 0 ? 'checked' : ''} required>
        <input type="text" class="q-option-input" placeholder="Option ${i + 1}" required>
      </div>
    `).join('')}
  `;
  wrap.querySelector('.remove-q-btn').addEventListener('click', () => {
    wrap.remove();
    renumberQuestionBlocks();
  });
  return wrap;
}

function renumberQuestionBlocks() {
  const blocks = questionList.querySelectorAll('.question-block');
  qBlockCount = blocks.length;
  blocks.forEach((b, i) => {
    b.querySelector('.question-block-head span').textContent = 'Question ' + (i + 1);
  });
}

document.getElementById('addQuestionBtn').addEventListener('click', () => {
  questionList.appendChild(makeQuestionBlock());
});

function renderCreateForm() {
  document.getElementById('createForm').reset();
  questionList.innerHTML = '';
  qBlockCount = 0;
  document.getElementById('createError').textContent = '';
  document.getElementById('quizCategory').selectedIndex = 0;
  document.getElementById('quizDifficulty').value = 'Medium';
  document.getElementById('quizTimer').value = 30;
  questionList.appendChild(makeQuestionBlock());
  questionList.appendChild(makeQuestionBlock());
}

document.getElementById('createForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('quizTitle').value.trim();
  const errorEl = document.getElementById('createError');
  const blocks = [...questionList.querySelectorAll('.question-block')];

  if (blocks.length === 0) {
    errorEl.textContent = 'Add at least one question.';
    return;
  }

  const questions = [];
  for (const block of blocks) {
    const text = block.querySelector('.q-text-input').value.trim();
    const optionInputs = [...block.querySelectorAll('.q-option-input')];
    const options = optionInputs.map(inp => inp.value.trim());
    const checkedRadio = block.querySelector('input[type="radio"]:checked');

    if (!text || options.some(o => !o) || !checkedRadio) {
      errorEl.textContent = 'Fill in every question, all four options, and mark a correct answer.';
      return;
    }
    questions.push({ text, options, correct: Number(checkedRadio.value) });
  }

  const quizzes = readJSON(STORAGE.quizzes, []);
  const timerValue = Number(document.getElementById('quizTimer').value) || 0;
  quizzes.push({
    id: uid(),
    title,
    author: state.currentUser,
    category: document.getElementById('quizCategory').value,
    difficulty: document.getElementById('quizDifficulty').value,
    timePerQuestion: Math.max(0, timerValue),
    questions,
    createdAt: Date.now(),
  });
  writeJSON(STORAGE.quizzes, quizzes);
  errorEl.textContent = '';
  showView('browse');
});

/* ---------- Browse ---------- */

const quizGrid = document.getElementById('quizGrid');
const browseEmpty = document.getElementById('browseEmpty');
const browseSearch = document.getElementById('browseSearch');
const filterCategory = document.getElementById('filterCategory');
const filterDifficulty = document.getElementById('filterDifficulty');

function diffClass(difficulty) {
  return 'diff-' + (difficulty || 'medium').toLowerCase();
}

function renderBrowse() {
  const term = browseSearch.value.trim().toLowerCase();
  const cat = filterCategory.value;
  const diff = filterDifficulty.value;

  const quizzes = readJSON(STORAGE.quizzes, [])
    .slice()
    .reverse()
    .filter(q => !term || q.title.toLowerCase().includes(term) || q.author.toLowerCase().includes(term))
    .filter(q => !cat || q.category === cat)
    .filter(q => !diff || q.difficulty === diff);

  quizGrid.innerHTML = '';
  browseEmpty.classList.toggle('hidden', quizzes.length > 0);

  quizzes.forEach(q => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    const mine = q.author === state.currentUser;
    card.innerHTML = `
      <h3>${escapeHTML(q.title)}</h3>
      <p class="quiz-meta">${q.questions.length} question${q.questions.length === 1 ? '' : 's'} · by ${escapeHTML(q.author)}${mine ? ' (you)' : ''}</p>
      <div class="quiz-badges">
        ${q.category ? `<span class="badge">${escapeHTML(q.category)}</span>` : ''}
        ${q.difficulty ? `<span class="badge ${diffClass(q.difficulty)}">${escapeHTML(q.difficulty)}</span>` : ''}
        ${q.timePerQuestion ? `<span class="badge">⏱ ${q.timePerQuestion}s/question</span>` : ''}
      </div>
      <div class="quiz-card-actions">
        <button class="btn btn-primary" data-take="${q.id}">Take quiz</button>
        <button class="btn btn-ghost" data-leaderboard="${q.id}">Leaderboard</button>
        ${mine ? `<button class="btn btn-ghost" data-delete="${q.id}">Delete</button>` : ''}
      </div>
    `;
    quizGrid.appendChild(card);
  });
}

browseSearch.addEventListener('input', renderBrowse);
filterCategory.addEventListener('change', renderBrowse);
filterDifficulty.addEventListener('change', renderBrowse);

quizGrid.addEventListener('click', (e) => {
  const takeBtn = e.target.closest('[data-take]');
  const delBtn = e.target.closest('[data-delete]');
  const lbBtn = e.target.closest('[data-leaderboard]');

  if (takeBtn) {
    startQuiz(takeBtn.dataset.take);
  }
  if (lbBtn) {
    showLeaderboard(lbBtn.dataset.leaderboard);
  }
  if (delBtn) {
    const quizzes = readJSON(STORAGE.quizzes, []).filter(q => q.id !== delBtn.dataset.delete);
    writeJSON(STORAGE.quizzes, quizzes);
    renderBrowse();
  }
});

/* ---------- Take quiz ---------- */

function startQuiz(quizId) {
  const quiz = readJSON(STORAGE.quizzes, []).find(q => q.id === quizId);
  if (!quiz) return;
  state.takeQuiz = quiz;
  state.takeIndex = 0;
  state.takeAnswers = quiz.questions.map(() => -1);
  state.takeLocked = quiz.questions.map(() => false);
  document.getElementById('takeQuizTitle').textContent = quiz.title;
  buildProgressDots();
  showView('take');
  renderQuestion();
}

function buildProgressDots() {
  const dots = document.getElementById('progressDots');
  dots.innerHTML = '';
  state.takeQuiz.questions.forEach(() => {
    const d = document.createElement('span');
    d.className = 'p-dot';
    dots.appendChild(d);
  });
}

function updateProgressDots() {
  const dots = document.getElementById('progressDots').children;
  [...dots].forEach((d, i) => {
    d.classList.toggle('done', state.takeLocked[i] && i !== state.takeIndex);
    d.classList.toggle('current', i === state.takeIndex);
  });
}

function renderQuestion() {
  const quiz = state.takeQuiz;
  const i = state.takeIndex;
  const q = quiz.questions[i];
  const locked = state.takeLocked[i];
  const picked = state.takeAnswers[i];

  document.getElementById('qCount').textContent = `Question ${i + 1} of ${quiz.questions.length}`;
  document.getElementById('qText').textContent = q.text;

  const optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';

    let cls = 'option-btn';
    if (locked) {
      if (idx === q.correct) cls += ' correct';
      else if (idx === picked) cls += ' incorrect';
      btn.disabled = true;
    } else if (picked === idx) {
      cls += ' selected';
    }
    btn.className = cls;
    btn.innerHTML = `<span class="option-bubble"></span><span>${escapeHTML(opt)}</span>`;

    if (!locked) {
      btn.addEventListener('click', () => {
        state.takeAnswers[i] = idx;
        state.takeLocked[i] = true;
        clearQuestionTimer();
        renderQuestion();
      });
    }
    optionsList.appendChild(btn);
  });

  document.getElementById('prevQBtn').disabled = i === 0;
  document.getElementById('prevQBtn').style.visibility = i === 0 ? 'hidden' : 'visible';

  const isLast = i === quiz.questions.length - 1;
  document.getElementById('nextQBtn').classList.toggle('hidden', isLast);
  document.getElementById('submitQuizBtn').classList.toggle('hidden', !isLast);
  document.getElementById('nextQBtn').disabled = !locked;
  document.getElementById('submitQuizBtn').disabled = !locked;

  updateProgressDots();
  startQuestionTimer();
}

function clearQuestionTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  if (state.advanceTimeout) {
    clearTimeout(state.advanceTimeout);
    state.advanceTimeout = null;
  }
}

function startQuestionTimer() {
  clearQuestionTimer();
  const i = state.takeIndex;
  const limit = state.takeQuiz ? state.takeQuiz.timePerQuestion : 0;
  const timerWrap = document.getElementById('timerWrap');

  if (state.takeLocked[i] || !limit || limit <= 0) {
    timerWrap.classList.add('hidden');
    return;
  }

  timerWrap.classList.remove('hidden');
  state.timeLeft = limit;
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearQuestionTimer();
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerWrap = document.getElementById('timerWrap');
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  document.getElementById('timerText').textContent = minutes + ':' + String(seconds).padStart(2, '0');
  timerWrap.classList.toggle('timer-warn', state.timeLeft <= 5);
}

function handleTimeUp() {
  const i = state.takeIndex;
  state.takeLocked[i] = true;
  renderQuestion();

  state.advanceTimeout = setTimeout(() => {
    state.advanceTimeout = null;
    if (state.takeIndex !== i) return; // user already navigated away manually
    const isLast = i === state.takeQuiz.questions.length - 1;
    if (isLast) {
      finishQuiz();
    } else {
      state.takeIndex += 1;
      renderQuestion();
    }
  }, 1200);
}

document.getElementById('prevQBtn').addEventListener('click', () => {
  if (state.takeIndex > 0) {
    state.takeIndex -= 1;
    renderQuestion();
  }
});

document.getElementById('nextQBtn').addEventListener('click', () => {
  if (!state.takeLocked[state.takeIndex]) {
    return; // must answer (or let the timer resolve) before proceeding
  }
  if (state.takeIndex < state.takeQuiz.questions.length - 1) {
    state.takeIndex += 1;
    renderQuestion();
  }
});

document.getElementById('submitQuizBtn').addEventListener('click', () => {
  if (!state.takeLocked[state.takeIndex]) {
    return;
  }
  finishQuiz();
});

/* ---------- Results ---------- */

function finishQuiz() {
  clearQuestionTimer();
  const quiz = state.takeQuiz;
  let score = 0;
  const answers = quiz.questions.map((q, i) => {
    const picked = state.takeAnswers[i];
    const isCorrect = picked === q.correct;
    if (isCorrect) score += 1;
    return {
      qText: q.text,
      options: q.options,
      correct: q.correct,
      picked,
    };
  });

  const allResults = readJSON(STORAGE.results, {});
  const userResults = allResults[state.currentUser] || [];
  userResults.push({
    id: uid(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    score,
    total: quiz.questions.length,
    date: Date.now(),
    answers,
  });
  allResults[state.currentUser] = userResults;
  writeJSON(STORAGE.results, allResults);

  state.lastResult = {
    title: quiz.title,
    user: state.currentUser,
    score,
    total: quiz.questions.length,
    date: Date.now(),
  };

  renderResults(quiz.title, score, quiz.questions.length, answers);
  showView('results');
}

function renderResults(title, score, total, answers) {
  document.getElementById('resultsQuizTitle').textContent = title;
  document.getElementById('scoreLine').textContent = `You scored ${score} out of ${total}.`;

  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const stamp = document.getElementById('scoreStamp');
  stamp.classList.toggle('pass', pct >= 60);
  document.getElementById('scorePercent').textContent = pct + '%';

  if (pct >= 80) {
    launchConfetti();
  }

  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  answers.forEach((a, i) => {
    const isCorrect = a.picked === a.correct;
    const item = document.createElement('div');
    item.className = 'review-item ' + (isCorrect ? 'correct' : 'incorrect');
    const pickedText = a.picked === -1 ? 'No answer' : a.options[a.picked];
    item.innerHTML = `
      <div class="review-q">${i + 1}. ${escapeHTML(a.qText)}</div>
      <div class="review-line">Your answer: <span class="${isCorrect ? 'tag-correct' : 'tag-incorrect'}">${escapeHTML(pickedText)}</span></div>
      ${!isCorrect ? `<div class="review-line">Correct answer: <span class="tag-correct">${escapeHTML(a.options[a.correct])}</span></div>` : ''}
    `;
    reviewList.appendChild(item);
  });
}

/* ---------- Confetti ---------- */

function launchConfetti() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const colors = ['#f0c93a', '#e76f51', '#8fd9a8', '#f1efe6'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '999';

  for (let n = 0; n < 50; n++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
}

/* ---------- Shareable result card ---------- */

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  words.forEach((word, n) => {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = word + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, curY);
  return curY;
}

function buildResultCardCanvas(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const bg = isLight ? '#f6f2e7' : '#1c2b23';
  const ink = isLight ? '#232922' : '#f1efe6';
  const yellow = isLight ? '#a9720a' : '#f0c93a';
  const mint = isLight ? '#2f9e57' : '#8fd9a8';
  const coral = isLight ? '#c14d2f' : '#e76f51';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = isLight ? 'rgba(35,41,34,0.07)' : 'rgba(241,239,230,0.07)';
  for (let y = 24; y < canvas.height; y += 28) {
    for (let x = 24; x < canvas.width; x += 28) {
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.strokeStyle = isLight ? 'rgba(35,41,34,0.28)' : 'rgba(241,239,230,0.28)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  ctx.setLineDash([]);

  ctx.fillStyle = yellow;
  ctx.font = '700 32px Georgia, serif';
  ctx.fillText('\u270E ChalkQuiz', 64, 96);

  const scoreColor = data.pct >= 60 ? mint : coral;
  const cx = canvas.width - 190;
  const cy = 180;
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(cx, cy, 105, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = scoreColor;
  ctx.font = '700 58px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.pct + '%', cx, cy + 20);
  ctx.textAlign = 'left';

  ctx.fillStyle = ink;
  ctx.font = '700 48px Georgia, serif';
  wrapCanvasText(ctx, data.title, 64, 280, 840, 54);

  ctx.globalAlpha = 0.78;
  ctx.fillStyle = ink;
  ctx.font = '400 27px Arial, sans-serif';
  ctx.fillText(`${data.score} / ${data.total} correct`, 64, 380);
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.6;
  ctx.font = '400 20px monospace';
  ctx.fillText(`@${data.user} \u00B7 ${data.dateLabel}`, 64, canvas.height - 60);
  ctx.globalAlpha = 1;

  return canvas;
}

function downloadResultCard() {
  if (!state.lastResult) return;
  const total = state.lastResult.total;
  const pct = total === 0 ? 0 : Math.round((state.lastResult.score / total) * 100);

  const canvas = buildResultCardCanvas({
    title: state.lastResult.title,
    user: state.lastResult.user,
    score: state.lastResult.score,
    total,
    pct,
    dateLabel: new Date(state.lastResult.date).toLocaleDateString(),
  });
  if (!canvas || !canvas.toBlob) return;

  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chalkquiz-result.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

document.getElementById('downloadCardBtn').addEventListener('click', downloadResultCard);

/* ---------- Leaderboard ---------- */

function showLeaderboard(quizId) {
  const quiz = readJSON(STORAGE.quizzes, []).find(q => q.id === quizId);
  if (!quiz) return;

  document.getElementById('leaderboardTitle').textContent = quiz.title;

  const allResults = readJSON(STORAGE.results, {});
  const bestByUser = {};

  Object.keys(allResults).forEach(user => {
    (allResults[user] || []).forEach(r => {
      if (r.quizId !== quizId) return;
      const pct = r.total ? r.score / r.total : 0;
      const existing = bestByUser[user];
      if (!existing || pct > existing.pct || (pct === existing.pct && r.date < existing.date)) {
        bestByUser[user] = { user, score: r.score, total: r.total, pct, date: r.date };
      }
    });
  });

  const rows = Object.values(bestByUser).sort((a, b) => b.pct - a.pct || a.date - b.date);

  const list = document.getElementById('leaderboardList');
  list.innerHTML = '';
  document.getElementById('leaderboardEmpty').classList.toggle('hidden', rows.length > 0);

  rows.slice(0, 10).forEach((r, i) => {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1);
    item.innerHTML = `
      <span class="lb-rank">${rank}</span>
      <span class="lb-user">${escapeHTML(r.user)}</span>
      <span class="lb-score">${r.score}/${r.total} · ${Math.round(r.pct * 100)}%</span>
    `;
    list.appendChild(item);
  });

  showView('leaderboard');
}

document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
  if (state.takeQuiz) {
    showLeaderboard(state.takeQuiz.id);
  }
});

/* ---------- Utility ---------- */

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Seed sample quizzes ---------- */

function seedQuizzesIfEmpty() {
  const existing = readJSON(STORAGE.quizzes, []);
  if (existing.length > 0) return;

  const seeded = [
    {
      id: uid(),
      title: 'Web Development Basics',
      author: 'ChalkQuiz Team',
      category: 'Web Development',
      difficulty: 'Easy',
      timePerQuestion: 30,
      createdAt: Date.now(),
      questions: [
        {
          text: 'What does HTML stand for?',
          options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'HighText Machine Language'],
          correct: 0,
        },
        {
          text: 'Which CSS property controls the size of text?',
          options: ['font-size', 'text-style', 'font-weight', 'text-size'],
          correct: 0,
        },
        {
          text: 'Which HTML tag links an external CSS file to a page?',
          options: ['<style>', '<link>', '<script>', '<css>'],
          correct: 1,
        },
        {
          text: 'In JavaScript, which keyword declares a variable that can be reassigned later?',
          options: ['const', 'let', 'final', 'static'],
          correct: 1,
        },
        {
          text: 'What does CSS stand for?',
          options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Styled Sheets', 'Colorful Style Syntax'],
          correct: 0,
        },
      ],
    },
    {
      id: uid(),
      title: 'World Geography Quickfire',
      author: 'ChalkQuiz Team',
      category: 'Geography',
      difficulty: 'Medium',
      timePerQuestion: 20,
      createdAt: Date.now(),
      questions: [
        {
          text: 'Which is the largest continent by area?',
          options: ['Africa', 'Asia', 'Europe', 'North America'],
          correct: 1,
        },
        {
          text: 'The Himalayas mountain range is home to which peak, the tallest above sea level?',
          options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Nanga Parbat'],
          correct: 2,
        },
        {
          text: 'Which river is traditionally cited as the longest in the world?',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          correct: 1,
        },
        {
          text: 'Which is the smallest country in the world by area?',
          options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
          correct: 1,
        },
        {
          text: 'Which country has the largest population as of the mid-2020s?',
          options: ['China', 'India', 'United States', 'Indonesia'],
          correct: 1,
        },
      ],
    },
    {
      id: uid(),
      title: 'Basic Mathematics',
      author: 'ChalkQuiz Team',
      category: 'Mathematics',
      difficulty: 'Easy',
      timePerQuestion: 25,
      createdAt: Date.now(),
      questions: [
        {
          text: 'What is 15 \u00D7 4?',
          options: ['45', '60', '50', '65'],
          correct: 1,
        },
        {
          text: 'What is the square root of 144?',
          options: ['11', '12', '13', '14'],
          correct: 1,
        },
        {
          text: 'What is 7 squared (7\u00B2)?',
          options: ['14', '49', '56', '42'],
          correct: 1,
        },
        {
          text: 'Simplify: 3/4 + 1/4',
          options: ['1/2', '1', '3/8', '5/4'],
          correct: 1,
        },
        {
          text: 'What is the value of \u03C0 (pi), rounded to two decimal places?',
          options: ['3.14', '3.41', '3.16', '3.12'],
          correct: 0,
        },
      ],
    },
    {
      id: uid(),
      title: 'Indian History Highlights',
      author: 'ChalkQuiz Team',
      category: 'History',
      difficulty: 'Medium',
      timePerQuestion: 20,
      createdAt: Date.now(),
      questions: [
        {
          text: 'In which year did India gain independence?',
          options: ['1945', '1947', '1950', '1930'],
          correct: 1,
        },
        {
          text: 'Who is widely known as the "Father of the Nation" in India?',
          options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel', 'Subhas Chandra Bose'],
          correct: 1,
        },
        {
          text: 'The Indian Constitution came into effect on which date?',
          options: ['15 August 1947', '26 January 1950', '2 October 1949', '26 November 1949'],
          correct: 1,
        },
        {
          text: "Who was India's first Prime Minister?",
          options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Rajendra Prasad', 'Lal Bahadur Shastri'],
          correct: 0,
        },
        {
          text: 'The Quit India Movement was launched in which year?',
          options: ['1942', '1930', '1857', '1919'],
          correct: 0,
        },
      ],
    },
    {
      id: uid(),
      title: 'Science Trivia',
      author: 'ChalkQuiz Team',
      category: 'Science',
      difficulty: 'Hard',
      timePerQuestion: 15,
      createdAt: Date.now(),
      questions: [
        {
          text: 'What is the chemical symbol for gold?',
          options: ['Au', 'Ag', 'Gd', 'Go'],
          correct: 0,
        },
        {
          text: 'Which gas do plants primarily absorb from the atmosphere for photosynthesis?',
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correct: 1,
        },
        {
          text: 'What is often called the powerhouse of the cell?',
          options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
          correct: 2,
        },
        {
          text: 'Which planet in our solar system has the most confirmed moons?',
          options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
          correct: 1,
        },
        {
          text: 'What is the SI unit of electric current?',
          options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
          correct: 1,
        },
      ],
    },
  ];

  writeJSON(STORAGE.quizzes, seeded);
}

/* ---------- Boot ---------- */

seedQuizzesIfEmpty();
refreshAuthUI();
if (state.currentUser) {
  showView('home');
} else {
  showView('auth');
}
