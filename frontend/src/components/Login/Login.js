// src/components/Login/Login.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Styled components
const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(45deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  maxWidth: 400,
  width: "100%",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(30, 30, 30, 0.8)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  padding: "12px",
  fontSize: "1.1rem",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  },
}));

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { login, error, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email inválido";
    }

    if (!formData.password) {
      errors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      errors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
    // Limpa o erro do campo quando o usuário começa a digitar
    if (validationErrors[prop]) {
      setValidationErrors({ ...validationErrors, [prop]: null });
    }
  };

  const handleClickShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  return (
    <LoginContainer>
      <LoginCard elevation={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Casa de Oração
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
              onChange={handleChange("email")}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={formData.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange("password")}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {formData.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoginButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </LoginButton>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "#90caf9",
                }}
              >
                <Typography variant="body2">Esqueceu a senha?</Typography>
              </Link>

              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#90caf9",
                }}
              >
                <Typography variant="body2">Criar uma conta</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
