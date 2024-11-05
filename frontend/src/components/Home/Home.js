// src/components/Home/Home.js
import React from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {user.name}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Próximos Eventos</Typography>
              {/* Adicionar conteúdo relevante aqui */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Avisos Importantes</Typography>
              {/* Adicionar conteúdo relevante aqui */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;
