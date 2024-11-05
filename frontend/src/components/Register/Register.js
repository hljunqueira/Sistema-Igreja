import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Importar plugins necessários do dayjs
import "dayjs/locale/pt-br";
import weekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Estender dayjs com os plugins
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

// Definir localização para português do Brasil
dayjs.locale("pt-br");

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isBaptized: false,
    baptismDate: null,
    phone: "",
    birthDate: null,
  });
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const { register, loading } = useAuth(); // Certifique-se de que register está sendo desestruturado aqui
  const navigate = useNavigate();

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

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Todos os campos obrigatórios devem ser preenchidos");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: "visitante",
        phone: formData.phone,
        birth_date: formData.birthDate
          ? formData.birthDate.toISOString()
          : null,
        is_baptized: formData.isBaptized,
        baptism_date: formData.baptismDate
          ? formData.baptismDate.toISOString()
          : null,
      };

      const result = await register(registerData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Registro realizado com sucesso!",
          severity: "success",
        });

        // Redirecionar após um breve delay
        setTimeout(() => {
          navigate("/registration-success");
        }, 2000);
      } else {
        setError(result.error || "Erro ao registrar usuário");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Registro
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmar Senha"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Nascimento"
              value={formData.birthDate}
              onChange={(date) => handleDateChange("birthDate", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox
                name="isBaptized"
                checked={formData.isBaptized}
                onChange={handleChange}
              />
            }
            label="É batizado?"
          />

          {formData.isBaptized && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data do Batismo"
                value={formData.baptismDate}
                onChange={(date) => handleDateChange("baptismDate", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />
            </LocalizationProvider>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Typography variant="body2" color="primary">
                Já tem uma conta? Faça login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Register;
