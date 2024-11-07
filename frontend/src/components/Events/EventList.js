import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import EventForm from "./EventForm";
import dayjs from "dayjs";
import { getEvents, deleteEvent } from "../../services/api"; // A importação de getEvents e deleteEvent deve ser feita do arquivo correto
import api from "../../services/api"; // Importando a instância do axios
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

// Função auxiliar para formatar data
const formatDateTime = (dateString) => {
  try {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

// Função auxiliar para traduzir tipo de evento
const translateEventType = (type) => {
  const types = {
    workshop: "Workshop",
    seminar: "Seminário",
    conference: "Conferência",
    meeting: "Reunião",
    culto: "Culto",
    estudo: "Estudo Bíblico",
    oracao: "Reunião de Oração",
    outro: "Outro",
  };
  return types[type] || type;
};

function EventList() {
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar eventos",
        severity: "error",
      });
    }
  };

  const handleOpenForm = (event = null) => {
    setSelectedEvent(event);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedEvent(null);
    setOpenForm(false);
  };

  const handleSubmit = async (eventData) => {
    try {
      if (selectedEvent) {
        // Atualizar evento
        await api.put(`/events/${selectedEvent.id}`, eventData);
        setSnackbar({
          open: true,
          message: "Evento atualizado com sucesso",
          severity: "success",
        });
      } else {
        // Criar novo evento
        await api.post("/events", eventData);
        setSnackbar({
          open: true,
          message: "Evento criado com sucesso",
          severity: "success",
        });
      }
      fetchEvents();
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao salvar evento",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await deleteEvent(id);
        fetchEvents();
        setSnackbar({
          open: true,
          message: "Evento excluído com sucesso",
          severity: "success",
        });
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
        setSnackbar({
          open: true,
          message: "Erro ao excluir evento",
          severity: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Eventos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenForm()}
        sx={{ mb: 2 }}
      >
        Criar Novo Evento
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Término</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{formatDateTime(event.start_datetime)}</TableCell>
                <TableCell>{formatDateTime(event.end_datetime)}</TableCell>
                <TableCell>{event.location || "Não especificado"}</TableCell>
                <TableCell>{translateEventType(event.event_type)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenForm(event)}>Editar</Button>
                  <Button onClick={() => handleDelete(event.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openForm && (
        <EventForm
          event={selectedEvent}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EventList;
