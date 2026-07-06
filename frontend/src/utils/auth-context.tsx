import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";
import { router } from "expo-router";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await api.getToken();
      if (token) {
        const userData = await api.get("/auth/me");
        setUser(userData);
      }
    } catch (e) {
      console.log("Check auth failed:", e);
      await api.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      await api.setToken(data.token);
      setUser(data.user);
      router.replace("/(tabs)/generate");
    } catch (e) {
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email: string, password: string) {
    setIsLoading(true);
    try {
      const data = await api.post("/auth/register", { email, password });
      await api.setToken(data.token);
      setUser(data.user);
      router.replace("/(tabs)/generate");
    } catch (e) {
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      await api.removeToken();
      setUser(null);
      router.replace("/login");
    } catch (e) {
      console.log("Logout failed:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
