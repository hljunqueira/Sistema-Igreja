import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  timeout: 10000,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@App:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const response = await api.post("/auth/refresh-token");
        const { token } = response.data;

        localStorage.setItem("@App:token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;

        // Repetir a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        // Se não conseguir renovar o token, fazer logout
        localStorage.removeItem("@App:token");
        localStorage.removeItem("@App:user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};
