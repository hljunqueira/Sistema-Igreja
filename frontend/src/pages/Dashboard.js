import React, { useState, useEffect } from "react";
import { Grid, Card, Chart } from "../components";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div className="dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card title="Total de Alunos" value={stats.totalStudents} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card title="Turmas Ativas" value={stats.activeClasses} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card title="Receita Mensal" value={`R$ ${stats.monthlyRevenue}`} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card title="Taxa de Presença" value={`${stats.attendanceRate}%`} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Chart
            title="Desempenho Acadêmico"
            type="line"
            data={performanceData}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chart
            title="Distribuição de Notas"
            type="pie"
            data={gradesDistribution}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
