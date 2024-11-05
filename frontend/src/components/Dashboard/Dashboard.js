// src/components/Dashboard/Dashboard.js
import React from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", membros: 100 },
  { name: "Fev", membros: 110 },
  { name: "Mar", membros: 115 },
  { name: "Abr", membros: 120 },
  { name: "Mai", membros: 125 },
  { name: "Jun", membros: 130 },
];

function Dashboard() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Total de Membros</Typography>
            <Typography variant="h4">130</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Eventos Próximos</Typography>
            <Typography variant="h4">3</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Total de Ministérios</Typography>
            <Typography variant="h4">8</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Crescimento de Membros</Typography>
            <LineChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="membros" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
