import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
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
  height: "100vh",
  backgroundColor: "#f5f5f5",
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  width: "100%",
  backgroundColor: "#fff",
  color: "#000",
  borderRadius: "8px",
}));

const BlackButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#000",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  bgcolor: "black",
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

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

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
  }, [formData]);

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

    try {
      const loginSuccess = await login(formData.email, formData.password);
      if (!loginSuccess) {
        // Se o login falhar, você pode exibir a mensagem de erro aqui
        console.error("Login falhou");
      }
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  return (
    <LoginContainer component="main">
      <CssBaseline />
      <Fade in={true} timeout={1000}>
        <LoginCard elevation={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <StyledAvatar>
              <img
                src="/LogoC.png"
                alt="Logotipo"
                style={{ width: "100%", height: "100%" }}
              />
            </StyledAvatar>
            <Typography component="h1" variant="h5">
              Entrar
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
                onChange={handleChange("email")}
                error={Boolean(validationErrors.email)}
                helperText={validationErrors.email}
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
                onChange={handleChange("password")}
                error={Boolean(validationErrors.password)}
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
              <BlackButton type="submit" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Entrar"}
              </BlackButton>
              <Link
                to="/register"
                style={{ textAlign: "center", display: "block" }}
              >
                Não tem uma conta? Cadastre-se
              </Link>
            </Box>
          </Box>
        </LoginCard>
      </Fade>
    </LoginContainer>
  );
}

export default Login;
