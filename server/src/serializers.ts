import { comments, findUserById, recipes, toPublicUser } from "./data/store.js";
import type { Cookbook, PublicUser, Recipe } from "./types.js";

// Turn raw stored entities into the richer shapes the client consumes: author
// info inlined, like/comment counts computed, and a `likedByMe` flag relative to
// the current viewer.

const authorOf = (authorId: string): PublicUser | null => {
  const user = findUserById(authorId);
  return user ? toPublicUser(user) : null;
};

const commentCount = (targetType: "recipe" | "cookbook", targetId: string) =>
  comments.filter(
    (c) => c.targetType === targetType && c.targetId === targetId,
  ).length;

export const serializeRecipe = (recipe: Recipe, viewerId: string) => ({
  id: recipe.id,
  title: recipe.title,
  imageUrl: recipe.imageUrl,
  description: recipe.description,
  ingredients: recipe.ingredients,
  directions: recipe.directions,
  cookingTimeMins: recipe.cookingTimeMins,
  views: recipe.views,
  likesCount: recipe.likedBy.length,
  likedByMe: recipe.likedBy.includes(viewerId),
  commentsCount: commentCount("recipe", recipe.id),
  author: authorOf(recipe.authorId),
});

export const serializeCookbook = (
  cookbook: Cookbook,
  viewerId: string,
  includeRecipes = false,
) => ({
  id: cookbook.id,
  title: cookbook.title,
  imageUrl: cookbook.imageUrl,
  description: cookbook.description,
  type: cookbook.type,
  recipeIds: cookbook.recipeIds,
  views: cookbook.views,
  likesCount: cookbook.likedBy.length,
  likedByMe: cookbook.likedBy.includes(viewerId),
  commentsCount: commentCount("cookbook", cookbook.id),
  author: authorOf(cookbook.authorId),
  recipes: includeRecipes
    ? cookbook.recipeIds
        .map((id) => recipes.find((r) => r.id === id))
        .filter((r): r is Recipe => Boolean(r))
        .map((r) => serializeRecipe(r, viewerId))
    : undefined,
});

export const serializeComment = (
  comment: import("./types.js").Comment,
) => ({
  id: comment.id,
  targetType: comment.targetType,
  targetId: comment.targetId,
  text: comment.text,
  createdAt: comment.createdAt,
  author: authorOf(comment.authorId),
});
