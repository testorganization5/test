import { queryOptions } from "@tanstack/react-query";
import { ApiError, request } from "./api";
import type { User } from "./types";

// Single source of truth for "who is the current user". `/me` returns the user
// when a valid auth cookie is present and 401s otherwise — we translate that 401
// into `null` (rather than a thrown error) so the query settles cleanly to a
// definite "signed out" state with no error/retry churn.
export const meQueryOptions = queryOptions({
  queryKey: ["me"] as const,
  queryFn: async (): Promise<User | null> => {
    try {
      return await request<User>("/me");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  },
  retry: false,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
});
