// Central configuration. In a real app these would all come from the
// environment; here we provide dev-friendly defaults so the demo runs with
// zero setup.

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const config = {
  port: Number(process.env.PORT ?? 8080),
  jwtSecret: process.env.JWT_SECRET ?? "feedme-dev-secret-change-me",
  jwtExpiresIn: "7d",
  /** Password reset tokens are valid for 15 minutes. */
  resetTokenTtlMs: 15 * 60 * 1000,
  bcryptSaltRounds: 10,
  /** Name of the httpOnly cookie that carries the JWT. */
  authCookieName: "feedme_token",
  /**
   * Options for the auth cookie. `httpOnly` keeps it out of reach of JS (so an
   * XSS bug can't steal the token), `sameSite: lax` blocks CSRF on cross-site
   * navigations, and `secure` is enabled outside development (HTTPS only).
   */
  authCookieOptions: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  },
};
