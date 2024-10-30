import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = localStorage.getItem("@App:token");
        const storedUser = localStorage.getItem("@App:user");

        if (storedToken && storedUser) {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do storage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", { email, password });

      const { token, user: userData } = response.data;

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(userData);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao realizar login";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(userData);
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao realizar registro";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    api.defaults.headers.Authorization = undefined;
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put("/users/profile", userData);

      const updatedUser = response.data;
      localStorage.setItem("@App:user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao atualizar perfil";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao recuperar senha";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await api.post("/auth/reset-password", { token, password });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao redefinir senha";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
