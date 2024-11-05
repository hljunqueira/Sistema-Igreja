// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStorageData = async () => {
      const storedToken = localStorage.getItem("@App:token");
      const storedUser = localStorage.getItem("@App:user");

      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar login");
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

      const { token, user } = response.data;

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar registro");
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
      setError("");

      const response = await api.put("/auth/profile", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.user;

      localStorage.setItem("@App:user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log("Perfil atualizado:", updatedUser);

      return updatedUser;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.response?.data?.message || "Erro ao atualizar perfil");
      throw err;
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
