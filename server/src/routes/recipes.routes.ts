import { Router } from "express";
import { requireAuth } from "../auth/middleware.js";
import {
  comments,
  nextId,
  recipes,
} from "../data/store.js";
import { serializeComment, serializeRecipe } from "../serializers.js";
import { validateBody } from "../validation/validate.js";
import {
  commentSchema,
  recipeSchema,
  recipeUpdateSchema,
} from "../validation/schemas.js";
import type { Recipe } from "../types.js";

export const recipesRouter = Router();
recipesRouter.use(requireAuth);

// GET /recipes?search=&sort=&maxCookingTime=&mine=&limit=
recipesRouter.get("/", (req, res) => {
  const viewerId = req.user!.id;
  const { search, sort, maxCookingTime, mine, limit } = req.query;

  let result = [...recipes];

  if (typeof search === "string" && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }

  if (mine === "true") {
    result = result.filter((r) => r.authorId === viewerId);
  }

  if (typeof maxCookingTime === "string" && maxCookingTime) {
    const max = Number(maxCookingTime);
    if (!Number.isNaN(max)) {
      result = result.filter((r) => r.cookingTimeMins <= max);
    }
  }

  switch (sort) {
    case "rating":
      result.sort((a, b) => b.likedBy.length - a.likedBy.length);
      break;
    case "cooking-time":
      result.sort((a, b) => a.cookingTimeMins - b.cookingTimeMins);
      break;
    case "newest":
      result.reverse();
      break;
    case "popularity":
    case "views":
    default:
      result.sort((a, b) => b.views - a.views);
  }

  if (typeof limit === "string" && Number(limit) > 0) {
    result = result.slice(0, Number(limit));
  }

  res.json(result.map((r) => serializeRecipe(r, viewerId)));
});

// GET /recipes/:id
recipesRouter.get("/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  recipe.views += 1; // viewing bumps the counter
  res.json(serializeRecipe(recipe, req.user!.id));
});

// POST /recipes
recipesRouter.post("/", validateBody(recipeSchema), (req, res) => {
  const recipe: Recipe = {
    id: nextId("r"),
    ...req.body,
    authorId: req.user!.id,
    views: 0,
    likedBy: [],
  };
  recipes.push(recipe);
  res.status(201).json(serializeRecipe(recipe, req.user!.id));
});

// PATCH /recipes/:id
recipesRouter.patch("/:id", validateBody(recipeUpdateSchema), (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  if (recipe.authorId !== req.user!.id) {
    return res.status(403).json({ message: "You can only edit your own recipes" });
  }
  Object.assign(recipe, req.body);
  res.json(serializeRecipe(recipe, req.user!.id));
});

// DELETE /recipes/:id
recipesRouter.delete("/:id", (req, res) => {
  const index = recipes.findIndex((r) => r.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: "Recipe not found" });
  if (recipes[index].authorId !== req.user!.id) {
    return res.status(403).json({ message: "You can only delete your own recipes" });
  }
  recipes.splice(index, 1);
  res.status(204).end();
});

// --- likes ---------------------------------------------------------------
recipesRouter.put("/:id/like", (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  if (!recipe.likedBy.includes(req.user!.id)) recipe.likedBy.push(req.user!.id);
  res.json(serializeRecipe(recipe, req.user!.id));
});

recipesRouter.delete("/:id/like", (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  recipe.likedBy = recipe.likedBy.filter((id) => id !== req.user!.id);
  res.json(serializeRecipe(recipe, req.user!.id));
});

// --- comments ------------------------------------------------------------
recipesRouter.get("/:id/comments", (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  const list = comments
    .filter((c) => c.targetType === "recipe" && c.targetId === recipe.id)
    .map(serializeComment);
  res.json(list);
});

recipesRouter.post("/:id/comments", validateBody(commentSchema), (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  const comment = {
    id: nextId("cm"),
    targetType: "recipe" as const,
    targetId: recipe.id,
    authorId: req.user!.id,
    text: req.body.text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  res.status(201).json(serializeComment(comment));
});
