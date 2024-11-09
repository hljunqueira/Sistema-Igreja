import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializa o useNavigate

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
      return true; // Indica que o login foi bem-sucedido
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Erro ao fazer login");
      return false; // Indica que o login falhou
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    navigate("/login"); // Redireciona para a página de login após o logout
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);
      return response.data; // Retorna os dados do usuário registrado
    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.response?.data?.message || "Erro ao registrar");
      return null; // Indica que o registro falhou
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put("/auth/update-user", userData);
      setUser(response.data.user); // Atualiza o usuário no estado
      return response.data; // Retorna os dados do usuário atualizado
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
      return null; // Indica que a atualização falhou
    } finally {
      setLoading(false);
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
