import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { Avatar } from "~/components/Avatar";
import "~/styles/profile.css";

export const Route = createFileRoute("/_appLayout/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  const { user } = useAuth();

  return (
    <div className="container page profile">
      <header className="profile__header">
        <Avatar src={user?.avatarUrl} name={user?.name} size={96} />
        <div>
          <h1 className="profile__name">{user?.name}</h1>
          <p className="profile__bio">{user?.bio || "No bio yet."}</p>
        </div>
      </header>

      <nav className="tabs profile__tabs">
        <Link
          to="/profile/cookbooks"
          className="tabs__tab"
          activeProps={{ className: "tabs__tab tabs__tab--active" }}
        >
          My Cookbooks
        </Link>
        <Link
          to="/profile/recipes"
          className="tabs__tab"
          activeProps={{ className: "tabs__tab tabs__tab--active" }}
        >
          My Recipes
        </Link>
        <Link
          to="/profile/settings"
          className="tabs__tab"
          activeProps={{ className: "tabs__tab tabs__tab--active" }}
        >
          My Settings
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
