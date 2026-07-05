import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.routes.js";
import { meRouter } from "./routes/users.routes.js";
import { recipesRouter } from "./routes/recipes.routes.js";
import { cookbooksRouter } from "./routes/cookbooks.routes.js";
import { commentsRouter } from "./routes/comments.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// All API routes live under /api so the Vite dev proxy can forward them.
const api = express.Router();
api.get("/health", (_req, res) => res.json({ status: "ok" }));

// Serve the OpenAPI document so it can be opened in Swagger UI / Redoc.
api.get("/openapi.yaml", (_req, res) => {
  const here = dirname(fileURLToPath(import.meta.url));
  const specPath = join(here, "..", "..", "openapi", "openapi.yaml");
  try {
    res.type("text/yaml").send(readFileSync(specPath, "utf8"));
  } catch {
    res.status(404).json({ message: "OpenAPI spec not found" });
  }
});

api.use("/auth", authRouter);
api.use("/me", meRouter);
api.use("/recipes", recipesRouter);
api.use("/cookbooks", cookbooksRouter);
api.use("/comments", commentsRouter);

app.use("/api", api);

// 404 for unknown API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Central error handler — catches thrown/next(err) errors.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Feedme API running on http://localhost:${config.port}/api`);
  console.log(`Demo login: john@feedme.dev / password123`);
});
