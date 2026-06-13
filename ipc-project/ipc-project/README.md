# Interview Preparation Core (IPC)

A practice platform that brings aptitude quizzes, MNC-specific previous-year
questions, and an AI-powered mock interview into one site, with Firebase
authentication.

## Project structure

```
ipc-project/
├── frontend/
│   ├── index.html          # Main single-page app (all views)
│   ├── app.js               # UI logic: quizzes, company panel, chat, dashboard
│   ├── data.js              # Sample aptitude + company question banks
│   └── firebase-config.js   # Firebase Auth (email/password + Google)
└── backend/
    ├── server.js             # Express entry point
    ├── package.json
    ├── .env.example
    ├── data/questions.js     # Same question banks, served via API
    ├── middleware/verifyFirebaseToken.js
    └── routes/
        ├── questions.js      # /api/questions/*
        └── mockInterview.js  # /api/mock-interview (Anthropic API)
```

## 1. Run the frontend

The frontend is plain HTML/CSS/JS — no build step needed. Serve the
`frontend/` folder with any static server, e.g.:

```bash
cd frontend
python3 -m http.server 5173
```

Open http://localhost:5173 in your browser. Without any further setup you can
already:
- Take aptitude quizzes (Quant, Logical, Verbal, Technical)
- Browse company-wise previous-year questions (TCS, Cognizant, Infosys, Wipro,
  Accenture, Amazon, Google, Microsoft)
- Try the AI mock interview chat in "offline demo mode" (scripted questions),
  which automatically switches to live AI once the backend is running.

## 2. Set up Firebase Authentication

1. Go to the [Firebase console](https://console.firebase.google.com) and
   create a new project.
2. **Project settings → General → Add app → Web app**. Copy the config
   object Firebase gives you.
3. Paste it into `frontend/firebase-config.js`, replacing the placeholder
   `firebaseConfig` object.
4. **Authentication → Sign-in method**: enable **Email/Password** and
   **Google**.
5. (For the backend) **Project settings → Service accounts → Generate new
   private key**. Save the downloaded JSON as `backend/serviceAccountKey.json`
   (this file should never be committed to source control).

Once configured, the "Log in" / "Sign up" buttons in the navbar will create
and authenticate real Firebase users, and the dashboard will show the signed-
in user's email.

## 3. Run the backend

```bash
cd backend
cp .env.example .env
# edit .env: add your ANTHROPIC_API_KEY and confirm FIREBASE_SERVICE_ACCOUNT_PATH
npm install
npm start
```

This starts an Express server on `http://localhost:4000` with:

- `GET /api/health` — health check
- `GET /api/questions/aptitude?category=quant` — aptitude question banks
- `GET /api/questions/companies` — list of companies
- `GET /api/questions/companies/:id` — full company detail + previous-year
  questions
- `POST /api/mock-interview` — AI interviewer (calls the Anthropic API with
  `ANTHROPIC_API_KEY`)
- `GET /api/profile` — example Firebase-protected route (requires
  `Authorization: Bearer <idToken>`)

### Connecting the frontend to the backend

The frontend's mock-interview chat calls `/api/mock-interview` directly. If
your frontend and backend run on different ports, either:

- Serve the frontend through the same Express app (add
  `app.use(express.static("../frontend"))` to `server.js`), or
- Add a reverse proxy / update the `fetch` URL in `app.js` to
  `http://localhost:4000/api/mock-interview`, and set `CLIENT_ORIGIN` in
  `.env` to your frontend's URL so CORS allows it.

## 4. Customize the content

- **Aptitude questions**: edit `frontend/data.js` (`APTITUDE_QUESTIONS`) and
  re-run the `module.exports` step for `backend/data/questions.js`, or load
  both from a shared source/database.
- **Company question banks**: edit `COMPANY_DATA` in the same file — add more
  companies, more previous-year questions, or update patterns as rounds
  change.
- **Mock interview persona**: edit `buildSystemPrompt()` in
  `backend/routes/mockInterview.js` to change tone, difficulty, or add
  company-specific interviewing styles (e.g. Amazon's Leadership Principles).

## 5. Design notes

The UI uses a "command core" visual theme: a glowing central orb (the "Core")
orbited by badges for companies and topics, with a parallax tilt on mouse
movement over the hero. Typography uses Space Grotesk (display), Inter
(body), and JetBrains Mono (data/timers/tags) loaded from Google Fonts.

## 6. Deploying

- **Frontend**: any static host (Firebase Hosting, Netlify, Vercel, GitHub
  Pages).
- **Backend**: any Node host (Render, Railway, Cloud Run, etc.). Set the same
  environment variables from `.env.example` in your host's dashboard, and
  upload `serviceAccountKey.json` as a secret file (do not commit it).
