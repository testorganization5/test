import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwt.js";
import { findUserById } from "../data/store.js";
import { config } from "../config.js";
import type { User } from "../types.js";

// Augment Express's Request so `req.user` is typed everywhere downstream.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Verifies the `Authorization: Bearer <token>` header, loads the user, and
 * attaches it to the request. Responds 401 when missing/invalid.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Primary source is the httpOnly cookie set at login. A Bearer header is also
  // accepted so API tools (Swagger UI, curl) can authenticate with a raw token.
  const header = req.headers.authorization;
  const token =
    req.cookies?.[config.authCookieName] ??
    (header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const { userId } = verifyToken(token);
    const user = findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
