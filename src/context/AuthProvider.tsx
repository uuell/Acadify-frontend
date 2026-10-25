import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../api/axios";
import { AuthContext } from "./auth-context";
import type { AuthMeResponse, AuthUser } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await api.get<AuthMeResponse>("/auth/me");

      setAuthenticated(response.data.authenticated);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to check authentication:", error);

      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await api.get<AuthMeResponse>("/auth/me");

        if (!cancelled) {
          setAuthenticated(response.data.authenticated);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);

        if (!cancelled) {
          setAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}