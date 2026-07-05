import { Router } from "express";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { clearAuthCookie, setAuthCookie } from "../auth/cookie.js";
import {
  findUserByEmail,
  nextId,
  resetTokens,
  toPublicUser,
  users,
} from "../data/store.js";
import { validateBody } from "../validation/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/schemas.js";
import type { User } from "../types.js";

export const authRouter = Router();

// POST /auth/register
authRouter.post("/register", validateBody(registerSchema), (req, res) => {
  const { name, email, password } = req.body;
  if (findUserByEmail(email)) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists" });
  }

  const user: User = {
    id: nextId("u"),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, config.bcryptSaltRounds),
    bio: "",
    avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
  };
  users.push(user);

  // Issue the JWT as an httpOnly cookie; the user object is safe to return.
  setAuthCookie(res, user.id);
  res.status(201).json({ user: toPublicUser(user) });
});

// POST /auth/login
authRouter.post("/login", validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  setAuthCookie(res, user.id);
  res.json({ user: toPublicUser(user) });
});

// POST /auth/logout — clears the auth cookie.
authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

// POST /auth/forgot-password
// In a real app this would email a link. For the demo we return the token
// directly so the reset flow can be exercised end-to-end.
authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  (req, res) => {
    const { email } = req.body;
    const user = findUserByEmail(email);
    if (user) {
      const token = nextId("reset");
      resetTokens.push({
        token,
        userId: user.id,
        expiresAt: Date.now() + config.resetTokenTtlMs,
      });
      return res.json({
        message: "Password reset token generated",
        // DEMO ONLY — normally delivered by email, never in the response.
        resetToken: token,
      });
    }
    // Do not reveal whether the email exists.
    res.json({ message: "If that email exists, a reset link has been sent" });
  },
);

// POST /auth/reset-password
authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  (req, res) => {
    const { token, password } = req.body;
    const index = resetTokens.findIndex((t) => t.token === token);
    const entry = index >= 0 ? resetTokens[index] : undefined;

    if (!entry || entry.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired" });
    }

    const user = users.find((u) => u.id === entry.userId);
    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid" });
    }

    user.passwordHash = bcrypt.hashSync(password, config.bcryptSaltRounds);
    resetTokens.splice(index, 1); // one-time use

    res.json({ message: "Password has been reset. You can now sign in." });
  },
);
