/**
 * User Model
 * ----------
 * Mongoose schema‑definition for application users.
 * 
 * Fields
 * ──────
 * • email       – Unique e‑mail address used for login and notifications.
 * • fullName    – User’s full display name.
 * • password    – BCrypt‑hashed password (minimum length: 6 characters).
 * • profilePic  – URL to the user’s avatar or profile image (optional).
 * 
 * Schema Options
 * ──────────────
 * { timestamps: true } automatically adds and maintains
 * `createdAt` and `updatedAt` fields on each document.
 */

import mongoose from "mongoose";

/* -----------------------------  Schema  ----------------------------- */
const userSchema = new mongoose.Schema(
  {
    /* Unique e‑mail address (required) */
    email: {
      type: String,
      required: true,
      unique: true,
      // Consider adding `lowercase: true` and a regex `match` to enforce format.
    },

    /* Full name as shown in the UI (required) */
    fullName: {
      type: String,
      required: true,
      // Optionally add `trim: true` to remove leading/trailing spaces.
    },

    /* Hashed password (required, min. 6 chars before hashing) */
    password: {
      type: String,
      required: true,
      minlength: 6,
      // Storing only a **hash** (never the plain password) is assumed.
    },

    /* Publicly accessible profile‑photo URL (optional) */
    profilePic: {
      type: String,
      default: "", // Empty string indicates “no custom image”.
    },
  },

  /* Automatically add createdAt / updatedAt ISO‑date fields */
  { timestamps: true }
);

/* -----------------------------  Model  ------------------------------ */
/**
 * The compiled Mongoose model.
 * Collection name defaults to “users” (pluralized, lowercase).
 */
const User = mongoose.model("User", userSchema);

export default User;

/* ----------------------------  End of file  -------------------------- */