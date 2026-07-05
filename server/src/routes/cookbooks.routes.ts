import { Router } from "express";
import { requireAuth } from "../auth/middleware.js";
import { comments, cookbooks, nextId } from "../data/store.js";
import { serializeComment, serializeCookbook } from "../serializers.js";
import { validateBody } from "../validation/validate.js";
import {
  commentSchema,
  cookbookSchema,
  cookbookUpdateSchema,
} from "../validation/schemas.js";
import type { Cookbook, CookbookType } from "../types.js";

export const cookbooksRouter = Router();
cookbooksRouter.use(requireAuth);

// GET /cookbooks?search=&sort=&type=&mine=&hideMine=&limit=
cookbooksRouter.get("/", (req, res) => {
  const viewerId = req.user!.id;
  const { search, sort, type, mine, hideMine, limit } = req.query;

  let result = [...cookbooks];

  if (typeof search === "string" && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }

  if (mine === "true") result = result.filter((c) => c.authorId === viewerId);
  if (hideMine === "true") result = result.filter((c) => c.authorId !== viewerId);

  // `type` may repeat (?type=vegetarian&type=without-milk); a cookbook matches
  // if it has ALL requested types.
  if (type) {
    const wanted = (Array.isArray(type) ? type : [type]) as CookbookType[];
    result = result.filter((c) => wanted.every((t) => c.type.includes(t)));
  }

  switch (sort) {
    case "rating":
    case "popular":
      result.sort((a, b) => b.likedBy.length - a.likedBy.length);
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

  res.json(result.map((c) => serializeCookbook(c, viewerId)));
});

// GET /cookbooks/:id  (detail includes nested recipes)
cookbooksRouter.get("/:id", (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  cookbook.views += 1;
  res.json(serializeCookbook(cookbook, req.user!.id, true));
});

// POST /cookbooks
cookbooksRouter.post("/", validateBody(cookbookSchema), (req, res) => {
  const cookbook: Cookbook = {
    id: nextId("c"),
    ...req.body,
    authorId: req.user!.id,
    views: 0,
    likedBy: [],
  };
  cookbooks.push(cookbook);
  res.status(201).json(serializeCookbook(cookbook, req.user!.id, true));
});

// PATCH /cookbooks/:id
cookbooksRouter.patch("/:id", validateBody(cookbookUpdateSchema), (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  if (cookbook.authorId !== req.user!.id) {
    return res.status(403).json({ message: "You can only edit your own cookbooks" });
  }
  Object.assign(cookbook, req.body);
  res.json(serializeCookbook(cookbook, req.user!.id, true));
});

// DELETE /cookbooks/:id
cookbooksRouter.delete("/:id", (req, res) => {
  const index = cookbooks.findIndex((c) => c.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: "Cookbook not found" });
  if (cookbooks[index].authorId !== req.user!.id) {
    return res.status(403).json({ message: "You can only delete your own cookbooks" });
  }
  cookbooks.splice(index, 1);
  res.status(204).end();
});

// POST /cookbooks/:id/clone  — copy someone else's cookbook into your account
cookbooksRouter.post("/:id/clone", (req, res) => {
  const source = cookbooks.find((c) => c.id === req.params.id);
  if (!source) return res.status(404).json({ message: "Cookbook not found" });
  const clone: Cookbook = {
    id: nextId("c"),
    title: source.title,
    imageUrl: source.imageUrl,
    description: source.description,
    type: [...source.type],
    recipeIds: [...source.recipeIds],
    authorId: req.user!.id,
    views: 0,
    likedBy: [],
  };
  cookbooks.push(clone);
  res.status(201).json(serializeCookbook(clone, req.user!.id, true));
});

// --- likes ---------------------------------------------------------------
cookbooksRouter.put("/:id/like", (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  if (!cookbook.likedBy.includes(req.user!.id)) cookbook.likedBy.push(req.user!.id);
  res.json(serializeCookbook(cookbook, req.user!.id));
});

cookbooksRouter.delete("/:id/like", (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  cookbook.likedBy = cookbook.likedBy.filter((id) => id !== req.user!.id);
  res.json(serializeCookbook(cookbook, req.user!.id));
});

// --- comments ------------------------------------------------------------
cookbooksRouter.get("/:id/comments", (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  const list = comments
    .filter((c) => c.targetType === "cookbook" && c.targetId === cookbook.id)
    .map(serializeComment);
  res.json(list);
});

cookbooksRouter.post("/:id/comments", validateBody(commentSchema), (req, res) => {
  const cookbook = cookbooks.find((c) => c.id === req.params.id);
  if (!cookbook) return res.status(404).json({ message: "Cookbook not found" });
  const comment = {
    id: nextId("cm"),
    targetType: "cookbook" as const,
    targetId: cookbook.id,
    authorId: req.user!.id,
    text: req.body.text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  res.status(201).json(serializeComment(comment));
});
