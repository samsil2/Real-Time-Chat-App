import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";

/**
 * Register a new user and return a JWT cookie.
 *
 * @route   POST /api/auth/signup
 * @access  Public
 *
 * @param {import('express').Request}  req – Expects { fullName, email, password } in the body.
 * @param {import('express').Response} res – Sends JSON payload plus “jwt” cookie on success.
 */
export const signup = async (req, res) => {
  // Extract user‑supplied credentials from the request body.
  const { fullName, email, password } = req.body;

  try {
    /* ------------------------------------------------------------------ */
    /* 1. Basic input validation                                          */
    /* ------------------------------------------------------------------ */
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    /* ------------------------------------------------------------------ */
    /* 2. Prevent duplicate accounts                                      */
    /* ------------------------------------------------------------------ */
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    /* ------------------------------------------------------------------ */
    /* 3. Securely hash the password                                      */
    /* ------------------------------------------------------------------ */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* ------------------------------------------------------------------ */
    /* 4. Persist the new user record                                     */
    /* ------------------------------------------------------------------ */
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    await newUser.save();

    /* ------------------------------------------------------------------ */
    /* 5. Issue a signed JWT in an HTTP‑only cookie                       */
    /* ------------------------------------------------------------------ */
    generateToken(newUser._id, res);

    /* ------------------------------------------------------------------ */
    /* 6. Send success response (password excluded)                       */
    /* ------------------------------------------------------------------ */
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    // Log the raw error for debugging, but send a generic message to client.
    console.error("Signup controller error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Authenticate an existing user and issue a JWT cookie for login
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * @param {import('express').Request}  req – Expects { email, password } in the body.
 * @param {import('express').Response} res – Returns user payload + “jwt” cookie on success.
 */
export const login = async (req, res) => {
  const { email, password } = req.body; // Credentials supplied by the client

  try {
    /* ------------------------------------------------------------------ */
    /* 1. Locate user by e‑mail                                           */
    /* ------------------------------------------------------------------ */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ------------------------------------------------------------------ */
    /* 2. Verify password                                                 */
    /* ------------------------------------------------------------------ */
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ------------------------------------------------------------------ */
    /* 3. Issue JWT cookie                                                */
    /* ------------------------------------------------------------------ */
    generateToken(user._id, res);

    /* ------------------------------------------------------------------ */
    /* 4. Success response (password omitted)                             */
    /* ------------------------------------------------------------------ */
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    // Log the raw error for internal debugging; send generic message to client.
    console.error("Login controller error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Log the user out by invalidating the JWT cookie.
 *
 * @route   POST /api/auth/logout
 * @access  Public
 *
 * @param {import('express').Request}  req – Incoming request object.
 * @param {import('express').Response} res – Express response object.
 */
export const logout = (req, res) => {
  try {
    // Clear the auth cookie:
    // • Set an empty value.
    // • maxAge 0 forces the browser to delete it immediately.
    res.cookie("jwt", "", { maxAge: 0 });

    // Confirm logout to the client.
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Surface error details internally; keep the client response generic.
    console.error("Logout controller error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

