
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";
import type { AuthUser } from "../services/authService";

// Authentication context types
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<boolean>;
  logout: () => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Authentication provider
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verify token and fetch current user
  const refreshUser = useCallback(async (): Promise<boolean> => {
    const token = sessionStorage.getItem("clientflow_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    setLoading(true);

    try {
      const response = await api.get<{
        success: boolean;
        user: AuthUser;
      }>("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success || !response.data.user) {
        sessionStorage.removeItem("clientflow_token");
        setUser(null);
        return false;
      }

      setUser(response.data.user);
      return true;
    } catch {
      sessionStorage.removeItem("clientflow_token");
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication when app starts
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  // Logout user
  const logout = useCallback(() => {
    sessionStorage.removeItem("clientflow_token");
    setUser(null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing authentication
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
