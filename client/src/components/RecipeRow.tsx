import type { Recipe } from "~/lib/types";
import { useToggleRecipeLike } from "~/hooks/useRecipes";
import { LikeButton } from "./LikeButton";
import "./RecipeRow.css";

interface RecipeRowProps {
  recipe: Recipe;
  onOpen: (id: string) => void;
}

export function RecipeRow({ recipe, onOpen }: RecipeRowProps) {
  const toggleLike = useToggleRecipeLike();

  return (
    <article className="row" onClick={() => onOpen(recipe.id)}>
      <img className="row__image" src={recipe.imageUrl} alt={recipe.title} />
      <div className="row__body">
        <div className="row__head">
          <h3 className="row__title">{recipe.title}</h3>
          <span className="row__author">{recipe.author?.name}</span>
        </div>
        <p className="row__desc">{recipe.description}</p>
        <div className="row__footer">
          <span className="card__stat">👁 {recipe.views.toLocaleString()} views</span>
          <LikeButton
            liked={recipe.likedByMe}
            count={recipe.likesCount}
            disabled={toggleLike.isPending}
            onToggle={() =>
              toggleLike.mutate({ id: recipe.id, liked: recipe.likedByMe })
            }
          />
          <span className="card__stat">💬 {recipe.commentsCount} comments</span>
          <span className="card__stat">⏱ {recipe.cookingTimeMins} min</span>
        </div>
      </div>
    </article>
  );
}
