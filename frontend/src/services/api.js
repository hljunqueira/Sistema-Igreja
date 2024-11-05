// frontend/src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3001/api";

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função auxiliar para configurar o token de autenticação
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

// Função de login
export const loginUser = async (email, password) => {
  try {
    console.log("Tentando login com:", { email });
    const response = await api.post("/auth/login", { email, password });

    // Se o login for bem-sucedido, armazena o token
    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw new Error(error.response?.data?.message || "Erro ao fazer login");
  }
};

// Função de registro
export const registerUser = async (name, email, password) => {
  try {
    console.log("Tentando registrar usuário:", { name, email });
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao registrar usuário"
    );
  }
};

// Função para obter dados do usuário
export const getUserData = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao obter dados do usuário"
    );
  }
};

// Função para atualizar dados do usuário
export const updateUserData = async (userData) => {
  try {
    const response = await api.put("/user", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    throw new Error(error.response?.data?.message || "Erro ao atualizar dados");
  }
};

// Função para verificar se o token está válido
export const checkAuthToken = async () => {
  try {
    const response = await api.get("/auth/verify-auth");
    return response.status === 200;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return false;
  }
};

// Função para fazer logout
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    setAuthToken(null);
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    setAuthToken(null);
    throw new Error(error.response?.data?.message || "Erro ao fazer logout");
  }
};

export default api;
