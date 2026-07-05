// Central configuration. In a real app these would all come from the
// environment; here we provide dev-friendly defaults so the demo runs with
// zero setup.

export const config = {
  port: Number(process.env.PORT ?? 8080),
  jwtSecret: process.env.JWT_SECRET ?? "feedme-dev-secret-change-me",
  jwtExpiresIn: "7d",
  /** Password reset tokens are valid for 15 minutes. */
  resetTokenTtlMs: 15 * 60 * 1000,
  bcryptSaltRounds: 10,
};
