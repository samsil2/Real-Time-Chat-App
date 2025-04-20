import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

/**
 * Middleware to protect routes by verifying JWT authentication.
 *
 * @route   Any protected route
 * @access  Private
 *
 * @param {import('express').Request}  req  – Express request, expects a 'jwt' cookie.
 * @param {import('express').Response} res  – Express response.
 * @param {import('express').NextFunction} next – Callback to pass control to next middleware.
 */
export const protectRoute = async (req, res, next) => {
  try {
    /* ------------------------------------------------------------------ */
    /* 1. Retrieve token from HTTP‑only cookie                            */
    /* ------------------------------------------------------------------ */
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    /* ------------------------------------------------------------------ */
    /* 2. Verify token validity                                          */
    /* ------------------------------------------------------------------ */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token" });
    }

    /* ------------------------------------------------------------------ */
    /* 3. Fetch user from database                                       */
    /* ------------------------------------------------------------------ */
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ------------------------------------------------------------------ */
    /* 4. Attach user to request object and proceed                       */
    /* ------------------------------------------------------------------ */
    req.user = user;
    return next();
  } catch (error) {
    // Log full error for debugging and return a generic server error.
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
