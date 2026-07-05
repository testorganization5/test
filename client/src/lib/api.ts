// Thin fetch wrapper around the Express API. Everything goes through `request`,
// which sends the auth cookie, sets JSON headers, and normalizes errors so
// callers (and react-query) get a consistent shape.
//
// The JWT lives in an httpOnly cookie set by the server, so it is never readable
// from JS. We just need `credentials: "include"` for the browser to send it.

/** Error thrown for non-2xx responses. Carries field errors from Zod (if any). */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;
  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export async function request<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: "include", // send/receive the httpOnly auth cookie
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data as { message?: string }).message ?? "Request failed",
      (data as { errors?: Record<string, string> }).errors,
    );
  }

  return data as T;
}
