import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { request, tokenStorage } from "~/lib/api";
import type { AuthResponse, User } from "~/lib/types";

interface AuthContextValue {
  user: User | null;
  /** True while we restore the session from a stored token on first load. */
  loading: boolean;
  isAuthenticated: boolean;
  /** Store the token + user after a successful login/register. */
  login: (auth: AuthResponse) => void;
  logout: () => void;
  /** Update the cached user (e.g. after editing the profile). */
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first mount, if we have a stored token, fetch the current user to
  // confirm it is still valid and hydrate the profile.
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setLoading(false);
      return;
    }
    request<User>("/me")
      .then((u) => setUserState(u))
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((auth: AuthResponse) => {
    tokenStorage.set(auth.token);
    setUserState(auth.user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUserState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser: setUserState,
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
