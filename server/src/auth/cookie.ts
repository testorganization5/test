import type { Response } from "express";
import { config } from "../config.js";
import { signToken } from "./jwt.js";

// Helpers for issuing and clearing the httpOnly auth cookie. The JWT never
// travels to client-side JS — the browser stores the cookie and sends it back
// automatically on same-origin requests.

export function setAuthCookie(res: Response, userId: string): void {
  res.cookie(config.authCookieName, signToken(userId), config.authCookieOptions);
}

export function clearAuthCookie(res: Response): void {
  const { maxAge, ...rest } = config.authCookieOptions;
  res.clearCookie(config.authCookieName, rest);
}
