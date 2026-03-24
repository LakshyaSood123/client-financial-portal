import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthStatus, SessionClaims } from "./session";
import { getStoredToken } from "./session";

interface AuthState {
  status: AuthStatus;
  claims: SessionClaims | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthState>({
  status: "loading",
  claims: null,
  accessToken: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    status: "loading",
    claims: null,
    accessToken: null,
  });

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuth({ status: "authenticated", claims: null, accessToken: token });
    } else {
      setAuth({ status: "unauthenticated", claims: null, accessToken: null });
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useIsBlocked() {
  const { claims } = useContext(AuthContext);
  return claims?.tenantStatus === "BLOCKED" || claims?.tenantStatus === "SUSPENDED";
}
