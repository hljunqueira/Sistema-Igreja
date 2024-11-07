// src/components/Events/PublicEventList.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import api from "../../services/api";

function PublicEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date().toISOString();
        const response = await api.get("/events", {
          params: {
            start_date: today,
          },
        });

        // Ordenar eventos por data
        const sortedEvents = response.data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );

        setEvents(sortedEvents);
      } catch (error) {
        setError("Erro ao carregar eventos");
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      dateStyle: "long",
      timeStyle: "short",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      workshop: "primary",
      seminar: "secondary",
      conference: "success",
      meeting: "warning",
      default: "default",
    };
    return colors[type] || colors.default;
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      workshop: "Workshop",
      seminar: "Seminário",
      conference: "Conferência",
      meeting: "Reunião",
      default: "Evento",
    };
    return labels[type] || labels.default;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Próximos Eventos
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Confira nossa programação de eventos
        </Typography>
      </Paper>

      {events.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Não há eventos programados no momento
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getEventTypeLabel(event.event_type)}
                      color={getEventTypeColor(event.event_type)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {event.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2">
                      {formatDate(event.start_date)}
                    </Typography>
                  </Box>

                  {event.location && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">{event.location}</Typography>
                    </Box>
                  )}

                  {event.is_recurring && (
                    <Chip
                      icon={<EventIcon />}
                      label="Evento Recorrente"
                      size="small"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default PublicEventList;
