import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    // Forward API calls to the Express backend during development so the
    // client can just call `/api/...` with no CORS or absolute URLs.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    // The TanStack Start plugin MUST come before the React plugin.
    tsConfigPaths(),
    // SPA mode: a client-rendered single-page app (a "regular" React app).
    // This keeps auth simple — the JWT lives in localStorage and route guards
    // run in the browser, with no server-side rendering to work around.
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
});
