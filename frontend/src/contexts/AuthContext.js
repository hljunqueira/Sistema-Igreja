// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api"; // Certifique-se de que este caminho está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          const response = await api.get("/user"); // Ajuste esta rota conforme sua API
          setUser(response.data);
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/login", { email, password }); // Ajuste esta rota conforme sua API
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    api.defaults.headers.common["Authorization"] = "";
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.put("/user", userData); // Ajuste esta rota conforme sua API
      setUser(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
