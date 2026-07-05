# Feedme — Cookbook Demo App

A small full-stack cooking app built to show junior developers what a "regular"
React application looks like end to end: a REST API, an OpenAPI contract, and a
modern React client with routing, data fetching, forms, validation and shared
state.

Implements **Phase I** of the cookbook brief: authentication, browsing/searching
recipes & cookbooks, likes, comments, and full CRUD for your own recipes and
cookbooks, all styled to the Figma design.

## Tech stack

| Layer      | Choice                                                           |
| ---------- | --------------------------------------------------------------- |
| Backend    | Express + TypeScript, in-memory data (no DB), JWT + bcrypt auth |
| API spec   | OpenAPI 3.1 (`openapi/openapi.yaml`)                            |
| Frontend   | TanStack Start (React 19, SPA mode) + TanStack Query           |
| Forms      | react-hook-form + Zod (`@hookform/resolvers`)                  |
| State      | React Context (auth) + TanStack Query (server cache)          |
| Styling    | Plain CSS files, one per component, driven by design tokens    |

## Project layout

```
├── openapi/openapi.yaml     # API contract (view in Swagger/Redoc)
├── server/                  # Express API
│   └── src/
│       ├── data/            # seed data + in-memory "store"
│       ├── auth/            # JWT helpers + requireAuth middleware
│       ├── validation/      # Zod schemas + validateBody middleware
│       ├── routes/          # auth / me / recipes / cookbooks / comments
│       └── index.ts         # app bootstrap
└── client/                  # TanStack Start SPA
    └── src/
        ├── routes/          # file-based routes (_authLayout / _appLayout)
        ├── components/      # UI components (each with its own .css)
        ├── hooks/           # TanStack Query hooks per resource
        ├── context/         # AuthContext
        ├── lib/             # api client, shared types, Zod schemas
        └── styles/          # design tokens + global/page CSS
```

## Getting started

Requires Node 20+ (developed on Node 22/24).

```bash
npm install          # installs both workspaces
npm run dev          # starts API (:8080) and client (:3000) together
```

Then open **http://localhost:3000**.

Run them individually if you prefer:

```bash
npm run dev:server   # http://localhost:8080/api
npm run dev:client   # http://localhost:3000  (proxies /api → :8080)
```

### Demo login

```
email:    john@feedme.dev
password: password123
```

(A second user `vasya@feedme.dev` / `password123` exists so you can see content
from other people.) You can also register a brand-new account from the UI.

> **Forgot password** returns the reset token directly in the API response
> (instead of emailing it) so the reset flow can be tried without a mail server.

## How it fits together

1. The client calls `/api/...` through a Vite dev proxy to the Express server.
2. `POST /auth/login` sets the JWT in an **httpOnly cookie** (`feedme_token`) —
   never exposed to JS — and the browser sends it back automatically. The API
   client uses `credentials: "include"`; `POST /auth/logout` clears the cookie.
3. Route guards in `_appLayout.tsx` (`beforeLoad`) confirm the session with a
   cached `GET /me` and redirect unauthenticated users to `/login`.
4. Data is read with TanStack Query hooks (`useRecipes`, `useCookbooks`, …) and
   changed with mutations that invalidate the cache so the UI refreshes.
5. Every form uses react-hook-form with a Zod resolver; the same validation
   rules are enforced again on the server.

## Useful scripts

```bash
npm run typecheck      # tsc --noEmit for both packages
npm run build          # production build of server + client
npm run openapi:lint   # lint the OpenAPI document with Redocly
```

## API docs (Swagger UI)

With the server running, open **http://localhost:8080/api/docs** for interactive
Swagger UI. Click **Authorize** and paste a JWT (from a `/auth/login` response)
to try the protected endpoints. The raw spec is served at
**http://localhost:8080/api/openapi.yaml**.

## Notes

- Data lives in plain arrays in `server/src/data` and **resets on restart** —
  perfect for experimenting.
- Food photos are loaded from the Unsplash CDN; avatars from pravatar.cc.
