import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tokenStorage } from "~/lib/api";
import { Logo } from "~/components/Logo";
import "~/styles/auth.css";

// Pathless layout for the auth screens. If already signed in, skip to home.
export const Route = createFileRoute("/_authLayout")({
  beforeLoad: () => {
    if (tokenStorage.get()) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="auth__card">
          <div className="auth__logo">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
      <div
        className="auth__image"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1000&q=80&auto=format&fit=crop)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
