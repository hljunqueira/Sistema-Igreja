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

// Verificar token existente ao inicializar
const token = localStorage.getItem("authToken");
if (token) {
  setAuthToken(token);
}

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      setAuthToken(null);
    }
    console.error("Response Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

// Funções de autenticação e gerenciamento de usuários
export const loginUser = async (email, password) => {
  try {
    console.log("Tentando login com:", { email });
    const response = await api.post("/auth/login", { email, password });

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
export const registerUser = async (userData) => {
  try {
    console.log("Tentando registrar usuário:", {
      name: userData.name,
      email: userData.email,
    });
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error(" Erro no registro:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao registrar usuário"
    );
  }
};

// Função para obter dados do usuário
export const getUserData = async () => {
  try {
    const response = await api.get("/user/profile");
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
    const response = await api.put("/user/profile", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    throw new Error(error.response?.data?.message || "Erro ao atualizar dados");
  }
};

// Função para atualizar imagem do perfil
export const updateProfileImage = async (formData) => {
  try {
    const response = await api.post("/user/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar imagem:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar imagem"
    );
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
      await api.post("/auth/logout");
    }
    setAuthToken(null);
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    setAuthToken(null);
    throw new Error(error.response?.data?.message || "Erro ao fazer logout");
  }
};

// Funções de administração
export const savePastorInfo = async (pastorData) => {
  try {
    const response = await api.post("/admin/pastores", pastorData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao salvar informações do pastor"
    );
  }
};

export const saveLiderInfo = async (liderData) => {
  try {
    const response = await api.post("/admin/lideres", liderData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao salvar informações do líder"
    );
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar status do usuário"
    );
  }
};

// Funções para gerenciar eventos
export const getEvents = async (params) => {
  try {
    const response = await api.get("/events", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao buscar eventos");
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post("/events", eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao criar evento");
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar evento"
    );
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao excluir evento");
  }
};

export default api;
