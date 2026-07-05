import type { ReactNode } from "react";
import type { Recipe } from "~/lib/types";
import { useToggleRecipeLike } from "~/hooks/useRecipes";
import { LikeButton } from "./LikeButton";
import "./Card.css";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (id: string) => void;
  actions?: ReactNode;
}

export function RecipeCard({ recipe, onOpen, actions }: RecipeCardProps) {
  const toggleLike = useToggleRecipeLike();

  return (
    <article className="card" onClick={() => onOpen(recipe.id)}>
      <div className="card__views">👁 {recipe.views.toLocaleString()} views</div>
      <img className="card__image" src={recipe.imageUrl} alt={recipe.title} />
      {actions && <div className="card__actions">{actions}</div>}

      <div className="card__body">
        <div className="card__head">
          <h3 className="card__title">{recipe.title}</h3>
          <span className="card__author">{recipe.author?.name}</span>
        </div>
        <p className="card__desc">{recipe.description}</p>
      </div>

      <div className="card__footer">
        <LikeButton
          liked={recipe.likedByMe}
          count={recipe.likesCount}
          disabled={toggleLike.isPending}
          onToggle={() =>
            toggleLike.mutate({ id: recipe.id, liked: recipe.likedByMe })
          }
        />
        <span className="card__stat">💬 {recipe.commentsCount} comments</span>
      </div>
    </article>
  );
}
