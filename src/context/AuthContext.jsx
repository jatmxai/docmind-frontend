import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, tokens } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!tokens.access) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      tokens.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokens.set(data.access_token, data.refresh_token);
    await fetchMe();
  };

  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });
    tokens.set(data.access_token, data.refresh_token);
    await fetchMe();
  };

  const loginAsDemo = async () => {
    const { data } = await api.post("/auth/demo");
    tokens.set(data.access_token, data.refresh_token);
    await fetchMe();
  };

  const logout = () => {
    tokens.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginAsDemo, logout, refresh: fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
