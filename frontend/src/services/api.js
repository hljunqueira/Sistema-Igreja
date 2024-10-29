// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3001/api", // Substitua pela URL base da sua API
});

export default api;
// frontend/src/services/api.js

const API_URL = "https://localhost:3001/api";

// Função de login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Função de registro
export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao registrar usuário");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Função para obter dados do usuário
export const getUserData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao obter dados do usuário");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Função para atualizar dados do usuário
export const updateUserData = async (token, userData) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar dados do usuário");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Função para solicitar redefinição de senha
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao solicitar redefinição de senha");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Função auxiliar para verificar se o token está válido
export const checkAuthToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

// Função para fazer logout (limpar token no backend se necessário)
export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    throw error;
  }
};
