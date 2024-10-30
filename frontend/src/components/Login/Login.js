import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { validateEmail } from "../../utils/validation";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Email inválido";
    }

    if (!formData.password) {
      errors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      errors.password = "A senha deve ter no mínimo 6 caracteres";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          setSnackbar({
            open: true,
            message: "Login realizado com sucesso!",
            severity: "success",
          });
          navigate("/dashboard");
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Erro ao realizar login",
          severity: "error",
        });
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 48 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <Typography variant="body2">
                Não tem uma conta? Registre-se
              </Typography>
            </Link>

            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: (theme) => theme.palette.primary.main,
                marginTop: 8,
                display: "inline-block",
              }}
            >
              <Typography variant="body2">Esqueceu sua senha?</Typography>
            </Link>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
