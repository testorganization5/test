import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny, z } from "zod";

/**
 * Middleware factory: validates `req.body` against a Zod schema. On failure it
 * responds 400 with a flat `errors` map ({ field: message }). On success it
 * replaces `req.body` with the parsed (and defaulted) data.
 */
export function validateBody<S extends ZodTypeAny>(schema: S) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_";
        if (!errors[key]) errors[key] = issue.message;
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    req.body = result.data as z.infer<S>;
    next();
  };
}
