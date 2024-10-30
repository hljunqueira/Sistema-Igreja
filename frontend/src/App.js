import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";

// Importe seus componentes
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Navigation from "./components/Navigation/Navigation";
import NotFound from "./components/NotFound/NotFound";
import MemberList from "./components/Members/MemberList";
import "./App.css";

// Componente PrivateRoute
const PrivateRoute = ({ children }) => {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" />;
};

// Componente PublicRoute
const PublicRoute = ({ children }) => {
  const { signed } = useAuth();
  return !signed ? children : <Navigate to="/dashboard" />;
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
                <Route
                  path="/members"
                  element={
                    <PrivateRoute>
                      <MemberList />
                    </PrivateRoute>
                  }
                />

                {/* Rota inicial */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* Rota 404 */}
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
