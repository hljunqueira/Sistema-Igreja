// frontend/src/components/Register/RegistrationSuccess.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

function RegistrationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // Redireciona após 3 segundos

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, [navigate]);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography component="h1" variant="h5" color="primary" gutterBottom>
          Registro Concluído com Sucesso!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Você será redirecionado para a página de login em alguns segundos...
        </Typography>
        <Box sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      </Paper>
    </Container>
  );
}

export default RegistrationSuccess;
