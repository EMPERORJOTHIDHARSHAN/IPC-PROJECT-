// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const questionsRouter = require("./routes/questions");
const mockInterviewRouter = require("./routes/mockInterview");
const verifyFirebaseToken = require("./middleware/verifyFirebaseToken");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

// ---- Firebase Admin init ----
// Only initializes if a service account file is present, so the server
// can still run for local testing of the question-bank endpoints
// before Firebase is configured.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
if (fs.existsSync(path.resolve(serviceAccountPath))) {
  admin.initializeApp({
    credential: admin.credential.cert(require(path.resolve(serviceAccountPath)))
  });
  console.log("Firebase Admin initialized.");
} else {
  console.warn(
    `Firebase service account not found at "${serviceAccountPath}". ` +
    `Routes using verifyFirebaseToken will return 401 until it's added.`
  );
}

// ---- Public routes ----
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/questions", questionsRouter);

// ---- AI mock interview (optional auth: works for guests, but if a
// Firebase token is sent it gets attached to req.user) ----
app.use("/api/mock-interview", verifyFirebaseToken(false), mockInterviewRouter);

// ---- Example protected route: user profile / saved progress ----
app.get("/api/profile", verifyFirebaseToken(true), (req, res) => {
  // req.user.uid / req.user.email are available here.
  // In a real app, fetch this user's saved quiz scores & progress from Firestore.
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    progress: { quizzesAttempted: 0, averageScore: 0, mockInterviews: 0 }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`IPC backend running on http://localhost:${PORT}`));
