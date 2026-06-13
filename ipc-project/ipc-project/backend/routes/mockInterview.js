// routes/mockInterview.js
const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory conversation store, keyed by a session id the client sends.
// For production, replace with Firestore (keyed by req.user.uid).
const sessions = new Map();

function buildSystemPrompt(company, role) {
  return `You are an experienced technical interviewer conducting a mock interview
for the role of "${role}" at "${company}".

Rules:
- Ask one question at a time (behavioral, technical, or aptitude-style, matching
  what ${company} is known to ask for this role).
- After the candidate answers, briefly evaluate the answer (1-2 sentences of
  feedback: what was strong, what could improve), then ask the next question.
- Keep your tone encouraging but realistic, like a real interviewer.
- If the candidate says "start", greet them briefly and ask your first question.
- Keep each response under 120 words.`;
}

// POST /api/mock-interview
// body: { sessionId, company, role, message }
router.post("/", async (req, res) => {
  try {
    const { sessionId = "default", company, role, message } = req.body;
    if (!company || !role || !message) {
      return res.status(400).json({ error: "company, role and message are required" });
    }

    if (!sessions.has(sessionId)) sessions.set(sessionId, []);
    const history = sessions.get(sessionId);
    history.push({ role: "user", content: message });

    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: buildSystemPrompt(company, role),
      messages: history
    });

    const reply = completion.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n");

    history.push({ role: "assistant", content: reply });
    sessions.set(sessionId, history.slice(-20)); // keep last 20 turns

    res.json({ reply });
  } catch (err) {
    console.error("Mock interview error:", err);
    res.status(500).json({ error: "Failed to generate interviewer response" });
  }
});

module.exports = router;
