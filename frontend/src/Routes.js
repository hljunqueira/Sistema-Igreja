import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // Importar o contexto de autenticação
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import AdminUsers from "./components/Admin/UserManagement";
import AdminSettings from "./components/Admin/Settings";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

// Componente para rota privada
const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Obtém informações do usuário do contexto
  return user ? children : <Navigate to="/login" />; // Redireciona se não estiver autenticado
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
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
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <AdminUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <PrivateRoute>
            <AdminSettings />
          </PrivateRoute>
        }
      />
      {/* Adicione outras rotas conforme necessário */}
    </Routes>
  );
};

export default AppRoutes;
