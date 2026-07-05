import { useCloneCookbook, useCookbook, useToggleCookbookLike } from "~/hooks/useCookbooks";
import { useAuth } from "~/context/AuthContext";
import { Spinner } from "./Spinner";
import { Button } from "./Button";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import "./Detail.css";

const TYPE_LABELS: Record<string, string> = {
  vegetarian: "Vegetarian",
  "without-milk": "Without Milk",
  "without-eggs": "Without Eggs",
};

export function CookbookDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const { data: cookbook, isLoading } = useCookbook(id);
  const clone = useCloneCookbook();
  const toggleLike = useToggleCookbookLike();

  if (isLoading || !cookbook) return <Spinner />;

  const isOwner = cookbook.author?.id === user?.id;

  return (
    <div className="detail">
      <div className="detail__top">
        <h1 className="detail__title">{cookbook.title}</h1>
        {!isOwner && (
          <Button
            onClick={() => clone.mutate(cookbook.id)}
            disabled={clone.isPending}
          >
            {clone.isSuccess ? "Cloned ✓" : "Clone To My CookBook"}
          </Button>
        )}
      </div>
      <p className="detail__author">by {cookbook.author?.name}</p>

      {cookbook.type.length > 0 && (
        <div className="card__tags detail__tags">
          {cookbook.type.map((t) => (
            <span key={t} className="card__tag">
              {TYPE_LABELS[t] ?? t}
            </span>
          ))}
        </div>
      )}

      <div className="detail__hero">
        <img src={cookbook.imageUrl} alt={cookbook.title} />
        <div>
          <h3 className="detail__subtitle">Description</h3>
          <p className="detail__desc">{cookbook.description}</p>
        </div>
      </div>

      <div className="detail__meta">
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

      <h3 className="detail__subtitle">Recipes</h3>
      <ul className="detail__recipes">
        {cookbook.recipes?.map((r) => (
          <li key={r.id} className="detail__recipe">
            <img src={r.imageUrl} alt={r.title} />
            <div className="detail__recipe-body">
              <div className="row__head">
                <h4>{r.title}</h4>
                <span className="card__author">{r.author?.name}</span>
              </div>
              <p className="card__desc">{r.description}</p>
              <div className="row__footer">
                <span className="card__stat">👁 {r.views.toLocaleString()}</span>
                <span className="card__stat">♥ {r.likesCount}</span>
                <span className="card__stat">⏱ {r.cookingTimeMins} min</span>
              </div>
            </div>
          </li>
        ))}
        {cookbook.recipes?.length === 0 && (
          <li className="muted">No recipes in this cookbook yet.</li>
        )}
      </ul>

      <CommentSection target="cookbook" targetId={cookbook.id} />
    </div>
  );
}
