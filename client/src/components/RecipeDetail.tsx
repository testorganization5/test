import { useRecipe, useToggleRecipeLike } from "~/hooks/useRecipes";
import { Spinner } from "./Spinner";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import "./Detail.css";

export function RecipeDetail({ id }: { id: string }) {
  const { data: recipe, isLoading } = useRecipe(id);
  const toggleLike = useToggleRecipeLike();

  if (isLoading || !recipe) return <Spinner />;

  return (
    <div className="detail">
      <div className="detail__top">
        <h1 className="detail__title">{recipe.title}</h1>
      </div>
      <p className="detail__author">by {recipe.author?.name}</p>

      <div className="detail__hero">
        <img src={recipe.imageUrl} alt={recipe.title} />
        <div>
          <h3 className="detail__subtitle">Description</h3>
          <p className="detail__desc">{recipe.description}</p>
          <p className="card__stat" style={{ marginTop: 12 }}>
            ⏱ {recipe.cookingTimeMins} min
          </p>
        </div>
      </div>

      <div className="detail__meta">
        <LikeButton
          liked={recipe.likedByMe}
          count={recipe.likesCount}
          disabled={toggleLike.isPending}
          onToggle={() =>
            toggleLike.mutate({ id: recipe.id, liked: recipe.likedByMe })
          }
        />
        <span className="card__stat">👁 {recipe.views.toLocaleString()} views</span>
        <span className="card__stat">💬 {recipe.commentsCount} comments</span>
      </div>

      <h3 className="detail__subtitle">Ingredients</h3>
      <ul className="detail__ingredients">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>
            <span>{ing.name}</span>
            <span className="muted">{ing.amount}</span>
          </li>
        ))}
      </ul>

      <h3 className="detail__subtitle">Directions</h3>
      <p className="detail__desc">{recipe.directions}</p>

      <CommentSection target="recipe" targetId={recipe.id} />
    </div>
  );
}
