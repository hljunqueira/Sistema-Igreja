// src/components/Navigation/Navigation.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../contexts/AuthContext"; // Adicione o hook useAuth

function Navigation() {
  const { user, logout } = useAuth(); // Use o hook para acessar o contexto de autenticação

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Casa de Oração
        </Typography>

        {user ? (
          // Botões para usuários autenticados
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/members">
              Membros
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Perfil
            </Button>
            {user.is_admin && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          // Botões para usuários não autenticados
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Registro
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
