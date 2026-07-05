import "./LikeButton.css";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  disabled?: boolean;
}

export function LikeButton({ liked, count, onToggle, disabled }: LikeButtonProps) {
  return (
    <button
      type="button"
      className={`like ${liked ? "like--on" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <span className="like__heart">{liked ? "♥" : "♡"}</span>
      <span className="like__count">{count} likes</span>
    </button>
  );
}
