import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { Button } from "./Button";
import "./Header.css";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__left">
          <Logo />
          <nav className="header__nav">
            <Link
              to="/recipes"
              className="header__link"
              activeProps={{ className: "header__link header__link--active" }}
            >
              Recipes
            </Link>
            <Link
              to="/cookbooks"
              className="header__link"
              activeProps={{ className: "header__link header__link--active" }}
            >
              Cookbooks
            </Link>
          </nav>
        </div>

        <div className="header__center">
          <SearchBar />
        </div>

        <div className="header__right">
          <Button
            variant="outline"
            onClick={() =>
              navigate({ to: "/profile/cookbooks", search: { create: true } })
            }
          >
            Create CookBook
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
