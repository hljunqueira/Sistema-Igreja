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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

// Importar plugins necessários do dayjs
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Estender dayjs com os plugins
dayjs.extend(customParseFormat);

// Definir localização para português do Brasil
dayjs.locale("pt-br");

function Registrar() {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    ehBatizado: false,
    dataBatismo: null,
    telefone: "",
    dataNascimento: null,
  });
  const [erro, setErro] = useState("");
  const [snackbar, setSnackbar] = useState({
    aberto: false,
    mensagem: "",
    severidade: "",
  });
  const { register, loading } = useAuth();
  const navegar = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setDadosFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (campo, valor) => {
    setDadosFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const validarFormulario = () => {
    if (
      !dadosFormulario.nome ||
      !dadosFormulario.email ||
      !dadosFormulario.senha
    ) {
      setErro("Todos os campos obrigatórios devem ser preenchidos");
      return false;
    }
    if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
      setErro("As senhas não coincidem");
      return false;
    }
    if (dadosFormulario.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const dadosRegistro = {
        name: dadosFormulario.nome, // Alterado para 'name' para corresponder à API
        email: dadosFormulario.email,
        password: dadosFormulario.senha, // Alterado para 'password' para corresponder à API
        user_type: "visitante",
        phone: dadosFormulario.telefone, // Alterado para 'phone' para corresponder à API
        birth_date: dadosFormulario.dataNascimento
          ? dayjs(dadosFormulario.dataNascimento).format("YYYY-MM-DD")
          : null,
        is_baptized: dadosFormulario.ehBatizado, // Alterado para 'is_baptized' para corresponder à API
        baptism_date: dadosFormulario.dataBatismo
          ? dayjs(dadosFormulario.dataBatismo).format("YYYY-MM-DD")
          : null,
      };

      const resultado = await register(dadosRegistro);

      if (resultado.success) {
        setSnackbar({
          aberto: true,
          mensagem: "Registro realizado com sucesso!",
          severidade: "success",
        });

        setTimeout(() => {
          navegar("/sucesso-registro");
        }, 2000);
      } else {
        setErro(resultado.error || "Erro ao registrar usuário");
      }
    } catch (err) {
      console.error("Erro no registro:", err);
      setErro(err.message || "Erro ao registrar usuário");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, aberto: false });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Registro
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome Completo"
            name="nome"
            value={dadosFormulario.nome}
            onChange={handleChange}
            autoComplete="name"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={dadosFormulario.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            name="senha"
            type="password"
            value={dadosFormulario.senha}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmar Senha"
            name="confirmarSenha"
            type="password"
            value={dadosFormulario.confirmarSenha}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <TextField
            margin="normal"
            fullWidth
            label="Telefone"
            name="telefone"
            value={dadosFormulario.telefone}
            onChange={handleChange}
            autoComplete="tel"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
            <DatePicker
              label="Data de Nascimento"
              value={dadosFormulario.dataNascimento}
              onChange={(data) => handleDateChange("dataNascimento", data)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />

            {dadosFormulario.ehBatizado && (
              <DatePicker
                label="Data do Batismo"
                value={dadosFormulario.dataBatismo}
                onChange={(data) => handleDateChange("dataBatismo", data)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />
            )}
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox
                name="ehBatizado"
                checked={dadosFormulario.ehBatizado}
                onChange={handleChange}
              />
            }
            label="É batizado?"
          />

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
        open={snackbar.aberto}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severidade}
          sx={{ width: "100%" }}
        >
          {snackbar.mensagem}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Registrar;
