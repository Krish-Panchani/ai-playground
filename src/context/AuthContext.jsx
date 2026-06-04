import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { api, clearAuthToken, getAuthToken, setAuthToken } from "../lib/api";
import { showError } from "../lib/toast";

const AuthContext = createContext(null);

const AUTH_USER_KEY = "ai-playground-auth-user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(getAuthToken()));

  const persistUser = useCallback((profile) => {
    setUser(profile);
    if (profile) {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const login = useCallback(
    ({ token, user: profile }) => {
      setAuthToken(token);
      persistUser(profile);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    persistUser(null);
  }, [persistUser]);

  const refreshProfile = useCallback(async () => {
    if (!getAuthToken()) {
      return null;
    }
    try {
      const response = await api.getMe();
      persistUser(response.data);
      return response.data;
    } catch (_error) {
      return null;
    }
  }, [persistUser]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      try {
        const response = await api.getMe();
        if (!cancelled) {
          persistUser(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          clearAuthToken();
          persistUser(null);
          showError(error, "Your session expired. Please sign in again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && getAuthToken()),
      login,
      logout,
      refreshProfile,
    }),
    [user, loading, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
