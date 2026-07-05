import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import "./SearchBar.css";

interface SearchBarProps {
  placeholder?: string;
  /** Where to send the query. Defaults to the recipe search page. */
  to?: "/recipes" | "/cookbooks";
  defaultValue?: string;
}

export function SearchBar({
  placeholder = "Find best recipes",
  to = "/recipes",
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to, search: { search: value || undefined } });
  };

  return (
    <form className="searchbar" onSubmit={onSubmit} role="search">
      <span className="searchbar__icon" aria-hidden="true">
        🔍
      </span>
      <input
        className="searchbar__input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search"
      />
    </form>
  );
}
