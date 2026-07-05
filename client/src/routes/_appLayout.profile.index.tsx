import { createFileRoute, redirect } from "@tanstack/react-router";

// /profile defaults to the cookbooks tab.
export const Route = createFileRoute("/_appLayout/profile/")({
  beforeLoad: () => {
    throw redirect({ to: "/profile/cookbooks" });
  },
});
