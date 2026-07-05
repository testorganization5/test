import bcrypt from "bcryptjs";
import { config } from "../config.js";
import type {
  Cookbook,
  Comment,
  PublicUser,
  Recipe,
  ResetToken,
  User,
} from "../types.js";
import { seedUsers } from "./users.js";
import { seedRecipes } from "./recipes.js";
import { seedCookbooks } from "./cookbooks.js";
import { seedComments } from "./comments.js";

// The "database" is just mutable in-memory arrays. Everything resets when the
// server restarts — which is exactly what we want for a teaching demo.

export const users: User[] = seedUsers.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  bio: u.bio,
  avatarUrl: u.avatarUrl,
  passwordHash: bcrypt.hashSync(u.password, config.bcryptSaltRounds),
}));

export const recipes: Recipe[] = seedRecipes.map((r) => ({ ...r }));
export const cookbooks: Cookbook[] = seedCookbooks.map((c) => ({ ...c }));
export const comments: Comment[] = seedComments.map((c) => ({ ...c }));
export const resetTokens: ResetToken[] = [];

// --- id helpers -----------------------------------------------------------
let counter = 1000;
export const nextId = (prefix: string): string => `${prefix}${++counter}`;

// --- lookups --------------------------------------------------------------
export const findUserById = (id: string) => users.find((u) => u.id === id);
export const findUserByEmail = (email: string) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

/** Strip the password hash before sending a user over the wire. */
export const toPublicUser = (user: User): PublicUser => {
  const { passwordHash, ...rest } = user;
  return rest;
};
