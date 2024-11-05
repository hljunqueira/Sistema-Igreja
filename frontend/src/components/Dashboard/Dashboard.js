// frontend/src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Erro ao carregar dados do dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Card - Total de Membros */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Total de Membros
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalMembers}
            </Typography>
          </Paper>
        </Grid>

        {/* Card - Eventos Próximos */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Eventos Próximos
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.upcomingEvents}
            </Typography>
          </Paper>
        </Grid>

        {/* Card - Total de Ministérios */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Total de Ministérios
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalMinistries}
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfico de Crescimento */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Crescimento de Membros
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dashboardData.memberGrowth}
                margin={{
                  top: 16,
                  right: 16,
                  bottom: 0,
                  left: 24,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  style={{
                    fontSize: "0.8rem",
                  }}
                />
                <YAxis
                  stroke="#666"
                  style={{
                    fontSize: "0.8rem",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="membros"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Novos Membros"
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
