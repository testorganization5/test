import { Link } from "@tanstack/react-router";
import "./Logo.css";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Feedme home">
      <svg
        className="logo__drop"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path
          fill="var(--primary-yellow)"
          d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"
        />
      </svg>
      <span className="logo__text">
        Feed<span className="logo__accent">me</span>
      </span>
    </Link>
  );
}
