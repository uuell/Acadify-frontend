import { createContext } from "react";
import type { AuthUser } from "../types/auth";

export interface AuthContextType {
  user: AuthUser | null;
  authenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);