// app.js
// Core front-end logic for Interview Preparation Core.
// Uses in-memory state only (no localStorage) so it stays artifact-safe.

const state = {
  view: "home",
  quiz: {
    category: "quant",
    index: 0,
    selected: null,
    answers: [],
    finished: false
  },
  session: {
    quizzesAttempted: 0,
    scoresSum: 0,
    companiesViewed: new Set(),
    interviewsStarted: 0
  },
  interview: {
    started: false,
    questionIndex: 0
  },
  authMode: "login",
  user: null // populated by firebase-config.js via window.onIPCAuthChange
};

// ---------- NAVIGATION ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelectorAll("#navLinks button").forEach(b => {
    b.classList.toggle("active", b.dataset.view === name);
  });
  state.view = name;
  if (name === "aptitude") renderQuiz();
  if (name === "companies") renderCompanies();
  if (name === "dashboard") renderDashboard();
}

document.querySelectorAll("#navLinks button").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// ---------- APTITUDE QUIZ ----------
function renderCategories() {
  const wrap = document.getElementById("quizCategories");
  wrap.innerHTML = "";
  Object.keys(APTITUDE_QUESTIONS).forEach(cat => {
    const chip = document.createElement("div");
    chip.className = "chip" + (cat === state.quiz.category ? " active" : "");
    chip.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    chip.addEventListener("click", () => {
      state.quiz = { category: cat, index: 0, selected: null, answers: [], finished: false };
      renderCategories();
      renderQuiz();
    });
    wrap.appendChild(chip);
  });
}

function renderQuiz() {
  renderCategories();
  const box = document.getElementById("quizBox");
  const questions = APTITUDE_QUESTIONS[state.quiz.category];
  const q = state.quiz;

  if (q.finished) {
    const correct = q.answers.filter((a, i) => a === questions[i].answer).length;
    const pct = Math.round((correct / questions.length) * 100);
    box.innerHTML = `
      <div class="result-box">
        <div class="score">${pct}%</div>
        <p style="margin-top:10px;color:var(--text-dim)">You got ${correct} out of ${questions.length} correct.</p>
        <button class="btn primary" style="margin-top:20px" id="retryBtn">Retry this category</button>
      </div>
      <div>${questions.map((item, i) => `
        <div class="pyq">
          <div class="q-text" style="font-size:1rem">${i + 1}. ${item.q}</div>
          <div class="options">
            ${item.options.map((opt, oi) => `
              <div class="option ${oi === item.answer ? "correct" : (oi === q.answers[i] && oi !== item.answer ? "incorrect" : "")}">${opt}</div>
            `).join("")}
          </div>
          <p style="color:var(--text-dim); font-size:0.85rem; margin-top:8px;">${item.explain}</p>
        </div>
      `).join("")}</div>
    `;
    document.getElementById("retryBtn").addEventListener("click", () => {
      state.quiz = { category: state.quiz.category, index: 0, selected: null, answers: [], finished: false };
      renderQuiz();
    });
    return;
  }

  const item = questions[q.index];
  box.innerHTML = `
    <div class="quiz-meta">
      <span>Question ${q.index + 1} of ${questions.length}</span>
      <span class="timer" id="timerDisplay">⏱ --:--</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${(q.index / questions.length) * 100}%"></div></div>
    <div class="q-text">${item.q}</div>
    <div class="options" id="optionsWrap">
      ${item.options.map((opt, oi) => `<div class="option" data-i="${oi}">${opt}</div>`).join("")}
    </div>
    <div class="quiz-nav">
      <span style="color:var(--text-dim); font-size:0.85rem;">Category: ${state.quiz.category}</span>
      <button class="btn primary" id="nextBtn">${q.index === questions.length - 1 ? "Finish" : "Next"}</button>
    </div>
  `;

  document.querySelectorAll("#optionsWrap .option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll("#optionsWrap .option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      state.quiz.selected = parseInt(opt.dataset.i);
    });
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    state.quiz.answers[q.index] = state.quiz.selected;
    if (q.index === questions.length - 1) {
      state.quiz.finished = true;
      const correct = state.quiz.answers.filter((a, i) => a === questions[i].answer).length;
      state.session.quizzesAttempted++;
      state.session.scoresSum += Math.round((correct / questions.length) * 100);
    } else {
      state.quiz.index++;
      state.quiz.selected = null;
    }
    renderQuiz();
  });

  startTimer();
}

let timerInterval = null;
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  let seconds = 60;
  const display = document.getElementById("timerDisplay");
  const update = () => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    if (display) display.textContent = `⏱ ${m}:${s}`;
  };
  update();
  timerInterval = setInterval(() => {
    seconds--;
    update();
    if (seconds <= 0) {
      clearInterval(timerInterval);
      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn) nextBtn.click();
    }
  }, 1000);
}

// ---------- COMPANY PREP ----------
function renderCompanies() {
  const grid = document.getElementById("companyGrid");
  grid.innerHTML = "";
  Object.entries(COMPANY_DATA).forEach(([key, c]) => {
    const card = document.createElement("div");
    card.className = "company-card";
    card.innerHTML = `<div class="ticker">${c.ticker}</div><h4>${c.name}</h4>`;
    card.addEventListener("click", () => showCompanyDetail(key));
    grid.appendChild(card);
  });
}

function showCompanyDetail(key) {
  const c = COMPANY_DATA[key];
  state.session.companiesViewed.add(key);
  const detail = document.getElementById("companyDetail");
  detail.classList.add("active");
  detail.innerHTML = `
    <h3>${c.name}</h3>
    <div class="pattern">${c.pattern}</div>
    <div class="rounds">${c.rounds.map(r => `<span class="round-tag">${r}</span>`).join("")}</div>
    <h4 style="font-family:var(--font-display); margin-bottom:10px;">Previous 5 Years' Questions</h4>
    ${c.pyqs.map(p => `
      <div class="pyq">
        <div class="meta"><span class="tag year">${p.year}</span><span class="tag">${p.topic}</span></div>
        <div>${p.q}</div>
      </div>
    `).join("")}
  `;
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- MOCK AI INTERVIEW ----------
const FALLBACK_QUESTIONS = [
  "Tell me about yourself and walk me through your most recent project.",
  "Why do you want to work for {company} as a {role}?",
  "Describe a challenging technical problem you solved. What was your approach?",
  "How do you handle disagreements with a teammate or manager?",
  "Do you have any questions for us before we wrap up?"
];

function addMessage(text, who) {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function handleChatSend() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";

  const company = document.getElementById("interviewCompany").value;
  const role = document.getElementById("interviewRole").value;

  if (!state.interview.started) {
    state.interview.started = true;
    state.session.interviewsStarted++;
  }

  // Try the backend AI endpoint first; fall back to a scripted question bank
  try {
    const res = await fetch("/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, message: text })
    });
    if (!res.ok) throw new Error("backend unavailable");
    const data = await res.json();
    addMessage(data.reply, "ai");
  } catch (err) {
    const q = FALLBACK_QUESTIONS[state.interview.questionIndex % FALLBACK_QUESTIONS.length]
      .replace("{company}", company)
      .replace("{role}", role);
    state.interview.questionIndex++;
    addMessage(q + "  (offline demo mode — connect the backend for live AI responses)", "ai");
  }
}

document.getElementById("chatSend").addEventListener("click", handleChatSend);
document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter") handleChatSend();
});

// ---------- DASHBOARD ----------
function renderDashboard() {
  document.getElementById("statQuizzes").textContent = state.session.quizzesAttempted;
  const avg = state.session.quizzesAttempted
    ? Math.round(state.session.scoresSum / state.session.quizzesAttempted)
    : 0;
  document.getElementById("statScore").textContent = avg + "%";
  document.getElementById("statCompanies").textContent = state.session.companiesViewed.size;
  document.getElementById("statInterviews").textContent = state.session.interviewsStarted;

  const accountEl = document.getElementById("accountStatus");
  accountEl.textContent = state.user
    ? `Signed in as ${state.user.email}. Your progress can now be synced to Firestore.`
    : "You're browsing as a guest. Sign in to sync this dashboard with Firebase.";
}

// ---------- AUTH MODAL ----------
const overlay = document.getElementById("authOverlay");
const authMsg = document.getElementById("authMsg");

function openAuth(mode) {
  state.authMode = mode;
  document.getElementById("authTitle").textContent = mode === "login" ? "Log in to IPC" : "Create your IPC account";
  document.getElementById("authSubmit").textContent = mode === "login" ? "Log in" : "Sign up";
  document.getElementById("tabLogin").classList.toggle("active", mode === "login");
  document.getElementById("tabSignup").classList.toggle("active", mode === "signup");
  authMsg.textContent = "";
  overlay.classList.add("active");
}

document.getElementById("loginBtn").addEventListener("click", () => openAuth("login"));
document.getElementById("signupBtn").addEventListener("click", () => openAuth("signup"));
document.getElementById("closeModal").addEventListener("click", () => overlay.classList.remove("active"));
document.getElementById("tabLogin").addEventListener("click", () => openAuth("login"));
document.getElementById("tabSignup").addEventListener("click", () => openAuth("signup"));

document.getElementById("authSubmit").addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!email || !password) {
    authMsg.textContent = "Please enter both email and password.";
    return;
  }
  authMsg.textContent = "Connecting to Firebase...";
  try {
    if (!window.ipcAuth) throw new Error("Firebase not configured yet (see firebase-config.js).");
    if (state.authMode === "login") {
      await window.ipcAuth.signIn(email, password);
    } else {
      await window.ipcAuth.signUp(email, password);
    }
    overlay.classList.remove("active");
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

document.getElementById("googleAuth").addEventListener("click", async () => {
  authMsg.textContent = "Connecting to Firebase...";
  try {
    if (!window.ipcAuth) throw new Error("Firebase not configured yet (see firebase-config.js).");
    await window.ipcAuth.signInWithGoogle();
    overlay.classList.remove("active");
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

// Called by firebase-config.js when auth state changes
window.onIPCAuthChange = (user) => {
  state.user = user;
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  if (user) {
    loginBtn.textContent = user.email;
    signupBtn.textContent = "Log out";
    signupBtn.onclick = () => window.ipcAuth.signOutUser();
  } else {
    loginBtn.textContent = "Log in";
    loginBtn.onclick = () => openAuth("login");
    signupBtn.textContent = "Sign up";
    signupBtn.onclick = () => openAuth("signup");
  }
  if (state.view === "dashboard") renderDashboard();
};

// ---------- HERO PARALLAX (floating gesture) ----------
const coreSystem = document.getElementById("coreSystem");
coreSystem.addEventListener("mousemove", e => {
  const rect = coreSystem.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  coreSystem.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
});
coreSystem.addEventListener("mouseleave", () => {
  coreSystem.style.transform = "rotateY(0deg) rotateX(0deg)";
});

// ---------- INIT ----------
renderCategories();
renderQuiz();
