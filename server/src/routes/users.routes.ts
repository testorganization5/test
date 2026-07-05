import { Router } from "express";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { requireAuth } from "../auth/middleware.js";
import { findUserByEmail, toPublicUser } from "../data/store.js";
import { validateBody } from "../validation/validate.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "../validation/schemas.js";

export const meRouter = Router();
meRouter.use(requireAuth);

// GET /me
meRouter.get("/", (req, res) => {
  res.json(toPublicUser(req.user!));
});

// PATCH /me
meRouter.patch("/", validateBody(updateProfileSchema), (req, res) => {
  const user = req.user!;
  const { name, email, bio, avatarUrl } = req.body;

  if (email && email !== user.email) {
    const existing = findUserByEmail(email);
    if (existing && existing.id !== user.id) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    user.email = email;
  }
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  res.json(toPublicUser(user));
});

// PATCH /me/password
meRouter.patch("/password", validateBody(changePasswordSchema), (req, res) => {
  const user = req.user!;
  const { currentPassword, newPassword } = req.body;

  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res
      .status(400)
      .json({ message: "Current password is incorrect", errors: { currentPassword: "Current password is incorrect" } });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, config.bcryptSaltRounds);
  res.json({ message: "Password updated" });
});
