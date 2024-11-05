// frontend/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";

// Componentes
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Navigation from "./components/Navigation/Navigation";
import MemberList from "./components/Members/MemberList";
import AddMember from "./components/Members/AddMember";
import EditMember from "./components/Members/EditMember";
import NotFound from "./components/NotFound/NotFound";

// Componentes Admin
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminMembers from "./components/Admin/AdminMembers";
import AdminEvents from "./components/Admin/AdminEvents";
import AdminMinistries from "./components/Admin/AdminMinistries";
import AdminFinance from "./components/Admin/AdminFinance";
import AdminSettings from "./components/Admin/AdminSettings";

import AdminRoute from "./components/Routes/AdminRoute";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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
                <Route
                  path="/members"
                  element={
                    <PrivateRoute>
                      <MemberList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/members/add"
                  element={
                    <PrivateRoute>
                      <AddMember />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/members/edit/:id"
                  element={
                    <PrivateRoute>
                      <EditMember />
                    </PrivateRoute>
                  }
                />

                {/* Rotas Administrativas */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/members"
                  element={
                    <AdminRoute>
                      <AdminMembers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <AdminRoute>
                      <AdminEvents />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/ministries"
                  element={
                    <AdminRoute>
                      <AdminMinistries />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/finance"
                  element={
                    <AdminRoute>
                      <AdminFinance />
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

                {/* Outras rotas */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
