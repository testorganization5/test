// API response shapes. These mirror the server's serializers and the schemas
// in openapi/openapi.yaml.

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

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
  cookingTimeMins: number;
  views: number;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  author: User | null;
}

export type CookbookType = "vegetarian" | "without-milk" | "without-eggs";

export interface Cookbook {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  type: CookbookType[];
  recipeIds: string[];
  views: number;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  author: User | null;
  /** Present only on the detail endpoint. */
  recipes?: Recipe[];
}

export interface Comment {
  id: string;
  targetType: "recipe" | "cookbook";
  targetId: string;
  text: string;
  createdAt: string;
  author: User | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
