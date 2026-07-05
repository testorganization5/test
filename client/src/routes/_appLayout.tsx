import { useEffect } from "react";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { Spinner } from "~/components/Spinner";

// Pathless layout for the authenticated part of the app. The JWT is in an
// httpOnly cookie we can't read from JS, so auth state comes from AuthContext
// (a cached `/me` request). We render a spinner until that resolves — which
// keeps the SPA shell and client render identical (no hydration mismatch) — and
// redirect from an effect once we know the user is signed out.
export const Route = createFileRoute("/_appLayout")({
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Read the location non-reactively so this effect doesn't re-fire (and
      // re-navigate) as the URL changes during the redirect.
      router.navigate({
        to: "/login",
        search: { redirect: router.state.location.href },
      });
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="page">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
