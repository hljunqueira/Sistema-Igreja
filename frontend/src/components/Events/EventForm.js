import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importar localização PT-BR
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Estender dayjs com plugins necessários
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Definir localização padrão
dayjs.locale("pt-br");

function EventForm({ open, onClose, onSubmit, event }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_datetime: dayjs().tz("America/Sao_Paulo"),
    end_datetime: dayjs().tz("America/Sao_Paulo").add(1, "hour"),
    location: "",
    event_type: "",
    is_recurring: false,
    recurrence_pattern: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_datetime: dayjs(event.start_datetime).tz("America/Sao_Paulo"),
        end_datetime: dayjs(event.end_datetime).tz("America/Sao_Paulo"),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        start_datetime: dayjs().tz("America/Sao_Paulo"),
        end_datetime: dayjs().tz("America/Sao_Paulo").add(1, "hour"),
        location: "",
        event_type: "",
        is_recurring: false,
        recurrence_pattern: "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validações básicas
      if (!formData.title?.trim()) {
        setSnackbarMessage("Título é obrigatório");
        setSnackbarOpen(true);
        return;
      }

      if (!formData.event_type) {
        setSnackbarMessage("Tipo de evento é obrigatório");
        setSnackbarOpen(true);
        return;
      }

      // Converter as datas para ISO String com timezone
      const startDateTime = dayjs(formData.start_datetime)
        .tz("America/Sao_Paulo")
        .toISOString();
      const endDateTime = dayjs(formData.end_datetime)
        .tz("America/Sao_Paulo")
        .toISOString();

      // Validação da data
      if (dayjs(startDateTime).isAfter(dayjs(endDateTime))) {
        setSnackbarMessage(
          "A data/hora de término deve ser posterior à data/hora de início."
        );
        setSnackbarOpen(true);
        return;
      }

      const submissionData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        location: formData.location?.trim() || "",
        event_type: formData.event_type,
        is_recurring: Boolean(formData.is_recurring),
        recurrence_pattern: formData.is_recurring
          ? formData.recurrence_pattern
          : null,
      };

      console.log("Dados sendo enviados:", submissionData);
      onSubmit(submissionData);
    },
    [formData, onSubmit]
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{event ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DateTimePicker
                    label="Data/Hora de Início"
                    value={formData.start_datetime}
                    onChange={(value) =>
                      handleDateChange("start_datetime", value)
                    }
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                >
                  <DateTimePicker
                    label="Data/Hora de Término"
                    value={formData.end_datetime}
                    onChange={(value) =>
                      handleDateChange("end_datetime", value)
                    }
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Localização"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Evento</InputLabel>
                  <Select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    label="Tipo de Evento"
                  >
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="seminar">Seminário</MenuItem>
                    <MenuItem value="conference">Conferência</MenuItem>
                    <MenuItem value="meeting">Reunião</MenuItem>
                    <MenuItem value="culto">Culto</MenuItem>
                    <MenuItem value="estudo">Estudo Bíblico</MenuItem>
                    <MenuItem value="oracao">Reunião de Oração</MenuItem>
                    <MenuItem value="outro">Outro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_recurring"
                      checked={formData.is_recurring}
                      onChange={handleChange}
                    />
                  }
                  label="Evento Recorrente"
                />
              </Grid>
              {formData.is_recurring && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Padrão de Recorrência</InputLabel>
                    <Select
                      name="recurrence_pattern"
                      value={formData.recurrence_pattern}
                      onChange={handleChange}
                      label="Padrão de Recorrência"
                    >
                      <MenuItem value="daily">Diariamente</MenuItem>
                      <MenuItem value="weekly">Semanalmente</MenuItem>
                      <MenuItem value="monthly">Mensalmente</MenuItem>
                      <MenuItem value="yearly">Anualmente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {event ? "Salvar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EventForm;
