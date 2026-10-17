"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  api,
  User,
  getToken,
  setToken as saveToken,
  removeToken as clearToken,
  getStoredUser,
  setStoredUser,
} from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false }),
  adminLogin: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
      // Asynchronously refresh user profile from backend
      api.auth
        .getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            setStoredUser(res.user);
          }
        })
        .catch(() => {
          // Token may have expired
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.auth.login(email, password);
      saveToken(res.token);
      setStoredUser(res.user);
      setTokenState(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      return { success: false, message };
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await api.auth.adminLogin(email, password);
      saveToken(res.token);
      setStoredUser(res.user);
      setTokenState(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Administrator login failed";
      return { success: false, message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.auth.register(name, email, password);
      saveToken(res.token);
      setStoredUser(res.user);
      setTokenState(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.auth.getProfile();
      if (res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
    } catch {
      // Ignore background refresh errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
