import jwt from "jsonwebtoken";

/**
 * Create a JSON Web Token for the user and set it as a secure cookie.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId – Unique user ID.
 * @param {import('express').Response} res – Express response object.
 * @returns {string} The signed JWT.
 */
export const generateToken = (userId, res) => {
  // 1. Sign a token that encodes the user’s ID and lasts 7 days.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 2. Store the token client‑side as an HTTP‑only cookie.
  //    • httpOnly:   Blocks access from JS (mitigates XSS).
  //    • sameSite:   Rejects cross‑site sends (mitigates CSRF).
  //    • secure:     HTTPS‑only outside development.
  //    • maxAge:     Auto‑expires after 7 days.
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};
