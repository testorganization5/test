import { z } from "zod";

// Request-body schemas. These are the server's source of truth for what a valid
// payload looks like; the client mirrors the same shapes with its own Zod copy.

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.string().min(1, "Amount is required"),
});

export const recipeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  imageUrl: z.string().url("Enter a valid image URL"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.array(ingredientSchema).min(1, "Add at least one ingredient"),
  directions: z.string().min(1, "Directions are required"),
  cookingTimeMins: z.number().int().positive("Cooking time must be positive"),
});

export const recipeUpdateSchema = recipeSchema.partial();

const cookbookTypeEnum = z.enum(["vegetarian", "without-milk", "without-eggs"]);

export const cookbookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  imageUrl: z.string().url("Enter a valid image URL"),
  description: z.string().min(1, "Description is required"),
  type: z.array(cookbookTypeEnum).default([]),
  recipeIds: z.array(z.string()).default([]),
});

export const cookbookUpdateSchema = cookbookSchema.partial();

export const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(1000),
});
