// Shared entity types for the in-memory "database".
// These mirror the shapes documented in openapi/openapi.yaml.

export interface User {
  id: string;
  name: string;
  email: string;
  /** bcrypt hash — never sent to the client. */
  passwordHash: string;
  bio: string;
  avatarUrl: string;
}

/** A user as exposed over the API (no passwordHash). */
export type PublicUser = Omit<User, "passwordHash">;

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
  directions: string;
  authorId: string;
  views: number;
  /** ids of users who liked this recipe. */
  likedBy: string[];
  cookingTimeMins: number;
}

export type CookbookType = "vegetarian" | "without-milk" | "without-eggs";

export interface Cookbook {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  type: CookbookType[];
  authorId: string;
  recipeIds: string[];
  views: number;
  likedBy: string[];
}

export type CommentTarget = "recipe" | "cookbook";

export interface Comment {
  id: string;
  targetType: CommentTarget;
  targetId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

/** A password reset token issued by /auth/forgot-password. */
export interface ResetToken {
  token: string;
  userId: string;
  expiresAt: number;
}
