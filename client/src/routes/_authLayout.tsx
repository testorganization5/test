import { useEffect } from "react";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { Logo } from "~/components/Logo";
import { Spinner } from "~/components/Spinner";
import "~/styles/auth.css";

// Pathless layout for the auth screens. If already signed in, skip to home.
export const Route = createFileRoute("/_authLayout")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.navigate({ to: "/" });
    }
  }, [loading, isAuthenticated, router]);

  // Render the spinner while resolving or while redirecting a signed-in user,
  // so the initial render matches the prerendered shell.
  if (loading || isAuthenticated) return <Spinner />;

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
