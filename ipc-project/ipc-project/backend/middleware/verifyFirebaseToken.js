// middleware/verifyFirebaseToken.js
// Verifies the Firebase ID token sent in the Authorization header
// (format: "Authorization: Bearer <idToken>") and attaches the
// decoded user info to req.user.

const admin = require("firebase-admin");

function verifyFirebaseToken(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      if (required) return res.status(401).json({ error: "Missing Authorization token" });
      req.user = null;
      return next();
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded; // { uid, email, ... }
      next();
    } catch (err) {
      if (required) return res.status(401).json({ error: "Invalid or expired token" });
      req.user = null;
      next();
    }
  };
}

module.exports = verifyFirebaseToken;
