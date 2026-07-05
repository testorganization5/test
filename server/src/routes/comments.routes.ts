import { Router } from "express";
import { requireAuth } from "../auth/middleware.js";
import { comments } from "../data/store.js";

export const commentsRouter = Router();
commentsRouter.use(requireAuth);

// DELETE /comments/:id — you may only delete your own comments.
commentsRouter.delete("/:id", (req, res) => {
  const index = comments.findIndex((c) => c.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: "Comment not found" });
  if (comments[index].authorId !== req.user!.id) {
    return res.status(403).json({ message: "You can only delete your own comments" });
  }
  comments.splice(index, 1);
  res.status(204).end();
});
