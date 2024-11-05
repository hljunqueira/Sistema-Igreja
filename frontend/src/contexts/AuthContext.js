import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  // Carregar usuário do token armazenado
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setAuthToken(token);
        try {
          const response = await api.get("/auth/verify-auth");
          setUser(response.data.user);
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
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setUser(user);
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
      const response = await api.post("/auth/register", userData);

      // Se o registro for bem-sucedido, armazena o token e o usuário
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setAuthToken(response.data.token);
        setUser(response.data.user);
      }

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.response?.data?.message || "Erro ao registrar usuário");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    navigate("/login"); // Redirecionar após o logout
  };

  const updateUser = async (userData) => {
    try {
      setError(null);
      const response = await api.put("/user", userData);
      setUser(response.data); // Atualiza o usuário com os dados retornados
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register, updateUser }}
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
