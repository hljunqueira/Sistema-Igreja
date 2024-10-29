// src/components/Navigation/Navigation.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Casa de Oração
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Perfil
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Registro
        </Button>
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
