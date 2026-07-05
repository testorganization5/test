import { z } from "zod";

// Client-side form schemas. They mirror the server's validation so the user
// gets instant feedback, and react-hook-form infers form types straight from
// these via `z.infer`.

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  bio: z.string().max(500, "Bio is too long").optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  imageUrl: z.string().min(1, "Image URL is required").url("Enter a valid URL"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.array(ingredientSchema).min(1, "Add at least one ingredient"),
  directions: z.string().min(1, "Directions are required"),
  cookingTimeMins: z.coerce
    .number()
    .int("Enter a whole number")
    .positive("Cooking time must be positive"),
});
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export const cookbookTypeSchema = z.enum([
  "vegetarian",
  "without-milk",
  "without-eggs",
]);

export const cookbookFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  imageUrl: z.string().min(1, "Image URL is required").url("Enter a valid URL"),
  description: z.string().min(1, "Description is required"),
  type: z.array(cookbookTypeSchema),
  recipeIds: z.array(z.string()),
});
export type CookbookFormValues = z.infer<typeof cookbookFormSchema>;

export const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});
export type CommentValues = z.infer<typeof commentSchema>;
