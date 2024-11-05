import React, { useState, useEffect, useCallback } from "react";
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
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Styled components
const LoginContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Ocupa a altura total da tela
  padding: theme.spacing(2),
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400, // Define uma largura máxima
  width: "100%", // Garante que o card não ultrapasse a largura do container
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [attemptCount, setAttemptCount] = useState(0);
  const { login, error, loading, user } = useAuth();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (attemptCount >= MAX_ATTEMPTS) {
      const timer = setTimeout(() => {
        setAttemptCount(0);
        setValidationErrors({});
      }, LOCKOUT_TIME);
      return () => clearTimeout(timer);
    }
  }, [LOCKOUT_TIME, attemptCount]);

  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
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
  }, [formData.email, formData.password]);

  const handleChange = useCallback(
    (prop) => (event) => {
      const value = event.target.value.trim();
      setFormData((prev) => ({ ...prev, [prop]: value }));
      setValidationErrors((prev) => ({ ...prev, [prop]: null }));
    },
    []
  );

  const handleClickShowPassword = useCallback(() => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (attemptCount >= MAX_ATTEMPTS) {
      setValidationErrors({
        email: `Muitas tentativas. Tente novamente após ${
          LOCKOUT_TIME / 60000
        } minutos.`,
      });
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/home");
      } else {
        setAttemptCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setAttemptCount((prev) => prev + 1);
    }
  };

  return (
    <LoginContainer>
      <Fade in={true} timeout={1000}>
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
                textAlign: "center",
              }}
            >
              Casa de Oração
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
              noValidate
            >
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
                disabled={loading || attemptCount >= MAX_ATTEMPTS}
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
                disabled={loading || attemptCount >= MAX_ATTEMPTS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={loading || attemptCount >= MAX_ATTEMPTS}
                      >
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

              {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Tentativas restantes: {MAX_ATTEMPTS - attemptCount}
                </Typography>
              )}

              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || attemptCount >= MAX_ATTEMPTS}
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
                <StyledLink to="/forgot-password">
                  <Typography variant="body2"> Esqueceu a senha?</Typography>
                </StyledLink>

                <StyledLink to="/register">
                  <Typography variant="body2">Criar uma conta</Typography>
                </StyledLink>
              </Box>
            </Box>
          </Box>
        </LoginCard>
      </Fade>
    </LoginContainer>
  );
}

export default Login;
