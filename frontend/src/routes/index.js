// src/routes/index.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Importação dos componentes de página
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import Profile from "../components/Profile/Profile";
import NotFound from "../components/NotFound/NotFound"; // Você precisará criar este componente

// Componente para rotas privadas
const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    // Você pode criar um componente de loading personalizado
    return <div>Carregando...</div>;
  }

  return signed ? children : <Navigate to="/login" replace />;
};

// Componente para rotas públicas (redireciona se já estiver logado)
const PublicRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return !signed ? children : <Navigate to="/dashboard" replace />;
};

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Rotas Privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Rota inicial */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesConfig;
