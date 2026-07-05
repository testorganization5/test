import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { Avatar } from "./Avatar";
import "./UserMenu.css";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="usermenu" onMouseLeave={() => setOpen(false)}>
      <button className="usermenu__trigger" onClick={() => setOpen((v) => !v)}>
        <Avatar src={user.avatarUrl} name={user.name} size={32} />
        <span className="usermenu__name">{user.name}</span>
      </button>

      {open && (
        <div className="usermenu__dropdown">
          <Link
            to="/profile/cookbooks"
            className="usermenu__item"
            onClick={() => setOpen(false)}
          >
            My profile
          </Link>
          <Link
            to="/profile/settings"
            className="usermenu__item"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <button className="usermenu__item usermenu__logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
