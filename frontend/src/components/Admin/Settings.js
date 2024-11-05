// src/components/Admin/Settings.js
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";

function Settings() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Configurações do Sistema
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações Gerais
            </Typography>
            <FormControlLabel
              control={<Switch />}
              label="Permitir registro de novos usuários"
            />
            <FormControlLabel
              control={<Switch />}
              label="Ativar notificações por email"
            />
            <FormControlLabel control={<Switch />} label="Modo de manutenção" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações de Segurança
            </Typography>
            <FormControlLabel
              control={<Switch />}
              label="Autenticação em duas etapas"
            />
            <FormControlLabel
              control={<Switch />}
              label="Registro de atividades"
            />
            <FormControlLabel control={<Switch />} label="Backup automático" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
