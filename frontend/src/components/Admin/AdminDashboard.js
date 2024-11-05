// frontend/src/components/Admin/AdminDashboard.js
import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import {
  People as PeopleIcon,
  Event as EventIcon,
  Church as ChurchIcon,
  Settings as SettingsIcon,
  MonetizationOn as FinanceIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Gerenciar Membros",
      description: "Cadastrar, editar e gerenciar membros da igreja",
      icon: <PeopleIcon fontSize="large" />,
      path: "/admin/members",
      color: "#1976d2",
    },
    {
      title: "Gerenciar Eventos",
      description: "Administrar eventos e programações da igreja",
      icon: <EventIcon fontSize="large" />,
      path: "/admin/events",
      color: "#2e7d32",
    },
    {
      title: "Ministérios",
      description: "Gerenciar ministérios e departamentos",
      icon: <ChurchIcon fontSize="large" />,
      path: "/admin/ministries",
      color: "#9c27b0",
    },
    {
      title: "Finanças",
      description: "Controle financeiro e relatórios",
      icon: <FinanceIcon fontSize="large" />,
      path: "/admin/finance",
      color: "#ed6c02",
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema",
      icon: <SettingsIcon fontSize="large" />,
      path: "/admin/settings",
      color: "#0288d1",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h2">
        Painel Administrativo
      </Typography>

      <Grid container spacing={3}>
        {adminModules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${module.color}15`,
                      borderRadius: "50%",
                      p: 2,
                      color: module.color,
                    }}
                  >
                    {module.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  align="center"
                >
                  {module.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {module.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: "auto", justifyContent: "center" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(module.path)}
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
