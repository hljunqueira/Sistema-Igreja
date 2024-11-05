// src/components/Navigation/Navigation.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function Navigation() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Casa de Oração
        </Typography>

        {/* Menu principal */}
        <Button color="inherit" component={Link} to="/home">
          Início
        </Button>

        {/* Menu do Dashboard */}
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>

        {/* Menu Administrativo - apenas para administradores */}
        {user?.user_type === "administrador" && (
          <>
            <Button color="inherit" component={Link} to="/admin/users">
              Usuários
            </Button>
            <Button color="inherit" component={Link} to="/admin/settings">
              Configurações
            </Button>
          </>
        )}

        {/* Perfil e Logout */}
        <Button color="inherit" component={Link} to="/profile">
          Perfil
        </Button>
        <Button color="inherit" onClick={logout}>
          Sair
        </Button>

        {/* Botão para alternar entre modo claro e escuro */}
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
