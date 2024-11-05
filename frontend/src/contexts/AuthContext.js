// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api, { setAuthToken } from "../services/api"; // Certifique-se de que este caminho está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do token armazenado
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          setAuthToken(token);
          const response = await api.get("/user"); // Ajuste esta rota conforme sua API
          setUser(response.data);
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
          localStorage.removeItem("authToken");
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post("/login", { email, password }); // Ajuste esta rota conforme sua API
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setUser(user);

      console.log("Usuário após login:", user); // Para debug
      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Erro ao fazer login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post("/register", userData); // Ajuste esta rota conforme sua API

      // Se o registro for bem-sucedido e retornar um token, fazer login automático
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Armazena o token
        setAuthToken(response.data.token); // Define o token para futuras requisições
        setUser(response.data.user); // Define o usuário no estado
      }

      return { success: true, data: response.data }; // Retorna sucesso e dados
    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.response?.data?.message || "Erro ao registrar usuário");
      return { success: false, error: err.response?.data?.message }; // Retorna erro
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      setError(null);
      const response = await api.put("/user", userData); // Ajuste esta rota conforme sua API
      setUser(response.data); // Atualiza o usuário com os dados retornados
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register, // Certifique-se de incluir register aqui
        updateUser,
      }}
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
