import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { Avatar } from "./Avatar";
import "./UserMenu.css";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the menu or pressing Escape. (A click-triggered
  // menu must not close on mouse-leave, or you can't reach its items.)
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const onLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="usermenu" ref={menuRef}>
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
