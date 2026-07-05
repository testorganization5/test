import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "~/lib/api";
import { meQueryOptions } from "~/lib/auth";
import type { User } from "~/lib/types";

interface AuthContextValue {
  user: User | null;
  /** True while the initial `/me` check is in flight. */
  loading: boolean;
  isAuthenticated: boolean;
  /** Called after a successful login/register (server has set the cookie). */
  login: (user: User) => void;
  logout: () => Promise<void>;
  /** Update the cached user (e.g. after editing the profile). */
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // The auth cookie is httpOnly (invisible to JS), so we learn who is logged in
  // by asking the server. A 401 simply means "not logged in".
  const { data, isLoading } = useQuery(meQueryOptions);
  const user = data ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: isLoading,
      isAuthenticated: Boolean(user),
      login: (u) => {
        queryClient.setQueryData(meQueryOptions.queryKey, u);
        // Any data cached for a previous session is now stale; refetch on use.
        queryClient.invalidateQueries({
          predicate: (q) => q.queryKey[0] !== "me",
        });
      },
      logout: async () => {
        await request("/auth/logout", { method: "POST" });
        // Flip to "signed out" synchronously (no refetch storm), so the route
        // guard sees `isAuthenticated === false` immediately and redirects.
        queryClient.setQueryData(meQueryOptions.queryKey, null);
      },
      setUser: (u) => queryClient.setQueryData(meQueryOptions.queryKey, u),
    }),
    [user, isLoading, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
