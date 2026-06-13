// routes/questions.js
const express = require("express");
const router = express.Router();
const { APTITUDE_QUESTIONS, COMPANY_DATA } = require("../data/questions");

// GET /api/questions/aptitude            -> all categories
// GET /api/questions/aptitude?category=quant
router.get("/aptitude", (req, res) => {
  const { category } = req.query;
  if (category) {
    if (!APTITUDE_QUESTIONS[category]) {
      return res.status(404).json({ error: `Unknown category: ${category}` });
    }
    return res.json({ [category]: APTITUDE_QUESTIONS[category] });
  }
  res.json(APTITUDE_QUESTIONS);
});

// GET /api/questions/companies            -> list of companies (no detail)
router.get("/companies", (req, res) => {
  const list = Object.entries(COMPANY_DATA).map(([id, c]) => ({
    id,
    name: c.name,
    ticker: c.ticker
  }));
  res.json(list);
});

// GET /api/questions/companies/:id        -> full detail incl. PYQs
router.get("/companies/:id", (req, res) => {
  const company = COMPANY_DATA[req.params.id];
  if (!company) return res.status(404).json({ error: "Company not found" });
  res.json(company);
});

module.exports = router;
