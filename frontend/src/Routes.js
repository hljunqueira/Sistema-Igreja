import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home"; // Certifique-se de que este componente está criado
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword"; // Importando ChangePassword
import AdminUsers from "./components/Admin/UserManagement";
import AdminSettings from "./components/Admin/Settings"; // Certifique-se de que este componente está criado
import Navigation from "./components/Navigation/Navigation";
import { useAuth } from "./contexts/AuthContext";
import RegistrationSuccess from "./components/Register/RegistrationSuccess"; // Importando a página de sucesso do registro

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.user_type === "administrador" ? (
    children
  ) : (
    <Navigate to="/home" replace />
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navigation />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/registration-success"
          element={<RegistrationSuccess />}
        />{" "}
        {/* Rota de sucesso do registro */}
        {/* Rotas protegidas */}
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
          path="/change-password" // Adicionando a rota de Alterar Senha
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        {/* Rotas administrativas */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        {/* Rota para página não encontrada */}
        <Route
          path="*"
          element={
            <div>
              <h2>404 - Página não encontrada</h2>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
