import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Remova a importação de Switch e Redirect

// Substitua Switch por Routes
<Routes>
  {/* Rotas públicas */}
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Rotas protegidas */}
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

  {/* Rota para página não encontrada */}
  <Route
    path="*"
    element={
      <div>
        <h2>404 - Página não encontrada</h2>
      </div>
    }
  />
</Routes>;

// Atualize o componente PrivateRoute
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
