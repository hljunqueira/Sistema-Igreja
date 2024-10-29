// src/components/Profile/Profile.js
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // Aqui você faria uma chamada à API para buscar os dados do usuário
    // Por enquanto, vamos usar dados mockados
    setUser({
      name: "João Silva",
      email: "joao@example.com",
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você enviaria os dados atualizados para a API
    console.log("Perfil atualizado:", user);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Perfil do Usuário
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Atualizar Perfil
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Profile;
