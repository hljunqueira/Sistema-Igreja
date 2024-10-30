// src/components/NotFound/NotFound.js
import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        A página que você está procurando não existe ou foi movida.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem" }}
      >
        Voltar para a página inicial
      </Button>
    </Container>
  );
};

export default NotFound;
