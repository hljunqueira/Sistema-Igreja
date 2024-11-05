// src/components/Navigation/Navigation.js
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function Navigation() {
  const { user, logout } = useAuth(); // Obtém informações do usuário e a função de logout do contexto de autenticação
  const { darkMode, toggleDarkMode } = useTheme(); // Obtém o estado do modo escuro e a função para alterná-lo

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Casa de Oração
        </Typography>

        <Box display="flex" alignItems="center">
          {user ? ( // Renderiza os botões de navegação apenas se o usuário estiver autenticado
            <>
              <Button color="inherit" component={Link} to="/home">
                Início
              </Button>

              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              {/* Renderiza botões administrativos apenas para usuários do tipo "administrador" */}
              {user.user_type === "administrador" && (
                <>
                  <Button color="inherit" component={Link} to="/admin/users">
                    Usuários
                  </Button>
                  <Button color="inherit" component={Link} to="/admin/settings">
                    Configurações
                  </Button>
                </>
              )}

              <Button color="inherit" component={Link} to="/profile">
                Perfil
              </Button>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            // Se não houver usuário, pode-se adicionar links para login ou registro
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registrar
              </Button>
            </>
          )}

          {/* Botão para alternar entre modo claro e escuro */}
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
