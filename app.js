// app.js — Quiz logic, timer, results, leaderboard
// -------------------------------------------------

// ---------- Small helpers ----------
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function getState() {
  return {
    username: localStorage.getItem('qa_username') || '',
    subject: localStorage.getItem('qa_subject') || '',
    answers: JSON.parse(localStorage.getItem('qa_answers') || '[]'),
  };
}
function setAnswers(arr) { localStorage.setItem('qa_answers', JSON.stringify(arr)); }

function saveResult({ username, subject, score, total }) {
  const percent = Math.round((score / total) * 100);
  const item = { username, subject, score, total, percent, ts: Date.now() };
  localStorage.setItem('qa_result', JSON.stringify(item));

  const key = 'qa_leaderboard';
  const board = JSON.parse(localStorage.getItem(key) || '[]');
  board.push(item);
  localStorage.setItem(key, JSON.stringify(board));
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Persist questions so result page doesn't need to load data.js again
function saveQuestionsForSession(questions) {
  localStorage.setItem('qa_questions', JSON.stringify(questions));
}
function loadQuestionsForSession() {
  try { return JSON.parse(localStorage.getItem('qa_questions') || '[]'); }
  catch { return []; }
}

// Prefer live QUIZ_DATA (from data.js). Fallback to saved copy.
function loadQuestionsBySubject(subject) {
  if (typeof window !== 'undefined' && window.QUIZ_DATA && window.QUIZ_DATA[subject]) {
    const q = window.QUIZ_DATA[subject].slice();
    saveQuestionsForSession(q);
    return q;
  }
  // Fallback (e.g., on result.html where data.js might not be included)
  return loadQuestionsForSession();
}

// ---------- QUIZ PAGE ----------
let timerId = null;
let timeLeft = 15;
let currentIndex = 0;
let questions = [];

function initQuizPage() {
  const { username, subject, answers } = getState();
  if (!username || !subject) { window.location.href = './index.html'; return; }

  // Labels
  $('#usernameLabel').textContent = username;
  $('#subjectLabel').textContent = subject;

  // Questions
  questions = loadQuestionsBySubject(subject);
  if (!questions || questions.length === 0) {
    alert('No questions found for this subject.');
    window.location.href = './index.html';
    return;
  }

  // Initialize answers (null = not answered)
  if (answers.length !== questions.length) {
    setAnswers(Array(questions.length).fill(null));
  }

  $('#qTotal').textContent = String(questions.length);

  // Buttons
  $('#prevBtn').addEventListener('click', onPrev);
  $('#nextBtn').addEventListener('click', onNextOrSubmit);

  renderQuestion();
  startTimer();
  updateButtons();
}

function renderQuestion() {
  const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');
  const q = questions[currentIndex];

  $('#qIndex').textContent = String(currentIndex + 1);
  $('#questionText').textContent = q.q;

  const optionsEl = $('#options');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const wrap = document.createElement('label');
    wrap.className = 'option';
    wrap.innerHTML = `
      <input type="radio" name="option" value="${idx}" ${answers[currentIndex] === idx ? 'checked' : ''}/>
      <span>${opt}</span>
    `;
    optionsEl.appendChild(wrap);
  });

  // Enable Next only if selected
  $('#nextBtn').disabled = (answers[currentIndex] === null);

  // Change handler
  $all('input[name="option"]').forEach(inp => {
    inp.addEventListener('change', () => {
      const val = Number(inp.value);
      const cur = JSON.parse(localStorage.getItem('qa_answers') || '[]');
      cur[currentIndex] = val;
      setAnswers(cur);
      $('#nextBtn').disabled = false;
      updateProgress();
    });
  });

  updateProgress();

  // Last question? change button text
  $('#nextBtn').textContent = (currentIndex === questions.length - 1) ? 'Submit ▶' : 'Next →';
}

function updateProgress() {
  const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');
  const answeredCount = answers.filter(v => v !== null).length;
  const pct = Math.round((answeredCount / questions.length) * 100);
  $('#progressPct').textContent = pct + '%';
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 15;
  $('#timeLeft').textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    $('#timeLeft').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      // Auto move next (or try submit on last)
      if (currentIndex === questions.length - 1) {
        submitQuiz(); // if unanswered, guard in submitQuiz will ask to choose
      } else {
        currentIndex++;
        renderQuestion();
        startTimer();
        updateButtons();
      }
    }
  }, 1000);
}

function onPrev() {
  if (currentIndex === 0) return;
  currentIndex--;
  renderQuestion();
  startTimer();
  updateButtons();
}

function onNextOrSubmit() {
  if (currentIndex === questions.length - 1) {
    const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');
    if (answers[currentIndex] === null) {
      alert('Please select an answer before submitting.');
      return;
    }
    submitQuiz();
    return;
  }
  const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');
  if (answers[currentIndex] === null) {
    alert('Please select an answer to continue.');
    return;
  }
  currentIndex++;
  renderQuestion();
  startTimer();
  updateButtons();
}

function updateButtons() {
  $('#prevBtn').disabled = (currentIndex === 0);
}

function submitQuiz() {
  clearInterval(timerId);
  const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');

  if (answers.length !== questions.length || answers.some(a => a === null)) {
    alert('Please answer all questions before submitting.');
    return;
  }

  const total = questions.length;
  let score = 0;
  answers.forEach((ans, i) => {
    if (ans === questions[i].answer) score++;
  });

  const { username, subject } = getState();
  saveResult({ username, subject, score, total });
  window.location.href = './result.html';
}

// ---------- RESULT PAGE ----------
function initResultPage() {
  const result = JSON.parse(localStorage.getItem('qa_result') || 'null');
  const answers = JSON.parse(localStorage.getItem('qa_answers') || '[]');
  const subject = localStorage.getItem('qa_subject') || '';
  const username = localStorage.getItem('qa_username') || '';

  if (!result || !answers.length || !subject) {
    window.location.href = './index.html';
    return;
  }

  // Load questions from saved session first; fallback to QUIZ_DATA if present
  let questions = loadQuestionsForSession();
  if (!questions || questions.length === 0) {
    if (typeof window !== 'undefined' && window.QUIZ_DATA && window.QUIZ_DATA[subject]) {
      questions = window.QUIZ_DATA[subject];
    } else {
      alert('Question set not found for review.');
      window.location.href = './index.html';
      return;
    }
  }
// Write header info  ✅ (use proper selectors + backticks)
  document.querySelector('#subjectOut').textContent  = subject;
  document.querySelector('#usernameOut').textContent = username;
  document.querySelector('#scoreVal').textContent    = '${result.score} / ${result.total}';
  document.querySelector('#percentVal').textContent  = '${result.percent}%';

  // Build the review list
  const ol = document.querySelector('#reviewList');
  ol.innerHTML = '';
  questions.forEach((q, i) => {
    const isCorrect = answers[i] === q.answer;
    const your = (answers[i] !== null && q.options[answers[i]] !== undefined)
      ? q.options[answers[i]]
      : '—';

    const li = document.createElement('li');
    li.className = isCorrect ? 'ok' : 'bad';
    li.innerHTML = `
      <div><strong>${q.q}</strong></div>
      <div>Your answer: <span class="${isCorrect ? 'correct' : 'incorrect'}">${your}</span></div>
      <div>Correct answer: <span class="correct">${q.options[q.answer]}</span></div>
    `;
    ol.appendChild(li);
  });
  
  $('#retakeBtn').addEventListener('click', () => {
    // Clear run-specific data; keep username + subject
    localStorage.removeItem('qa_answers');
    localStorage.removeItem('qa_result');
    window.location.href = './quiz.html';
  });
}

// ---------- LEADERBOARD PAGE ----------
function initLeaderboardPage() {
  const key = 'qa_leaderboard';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');

  arr.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.ts - a.ts;
  });

  const top5 = arr.slice(0, 5);
  const tbody = $('#lbBody');
  tbody.innerHTML = '';
  top5.forEach((it, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${it.username}</td>
      <td>${it.subject}</td>
      <td>${it.score} / ${it.total}</td>
      <td>${it.percent}%</td>
      <td>${formatDate(it.ts)}</td>
    `;
    tbody.appendChild(tr);
  });
}