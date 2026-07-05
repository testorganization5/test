import type { ReactNode } from "react";
import type { Cookbook } from "~/lib/types";
import { useToggleCookbookLike } from "~/hooks/useCookbooks";
import { LikeButton } from "./LikeButton";
import "./Card.css";

interface CookbookCardProps {
  cookbook: Cookbook;
  onOpen: (id: string) => void;
  /** Optional hover actions (edit/delete/clone). */
  actions?: ReactNode;
}

export function CookbookCard({ cookbook, onOpen, actions }: CookbookCardProps) {
  const toggleLike = useToggleCookbookLike();

  return (
    <article className="card" onClick={() => onOpen(cookbook.id)}>
      <div className="card__views">👁 {cookbook.views.toLocaleString()} views</div>
      <img className="card__image" src={cookbook.imageUrl} alt={cookbook.title} />
      {actions && <div className="card__actions">{actions}</div>}

      <div className="card__body">
        <div className="card__head">
          <h3 className="card__title">{cookbook.title}</h3>
          <span className="card__author">{cookbook.author?.name}</span>
        </div>
        <p className="card__desc">{cookbook.description}</p>
      </div>

      <div className="card__footer">
        <LikeButton
          liked={cookbook.likedByMe}
          count={cookbook.likesCount}
          disabled={toggleLike.isPending}
          onToggle={() =>
            toggleLike.mutate({ id: cookbook.id, liked: cookbook.likedByMe })
          }
        />
        <span className="card__stat">💬 {cookbook.commentsCount} comments</span>
      </div>
    </article>
  );
}
