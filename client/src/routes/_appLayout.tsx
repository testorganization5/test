import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tokenStorage } from "~/lib/api";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";

// Pathless layout for the authenticated part of the app. `beforeLoad` runs in
// the browser (SPA mode) and bounces anyone without a token to /login.
export const Route = createFileRoute("/_appLayout")({
  beforeLoad: ({ location }) => {
    if (!tokenStorage.get()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AppLayout,
});

function AppLayout() {
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
