// frontend/src/components/Members/AddMember.js
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function AddMember() {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    baptismDate: "",
    observations: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/members", member);
      navigate("/members");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao adicionar membro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Adicionar Novo Membro
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            name="name"
            value={member.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={member.email}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Telefone"
            name="phone"
            value={member.phone}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Endereço"
            name="address"
            value={member.address}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Data de Nascimento"
            name="birthDate"
            type="date"
            value={member.birthDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Data de Batismo"
            name="baptismDate"
            type="date"
            value={member.baptismDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Observações"
            name="observations"
            multiline
            rows={4}
            value={member.observations}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Adicionar Membro"}
          </Button>
        </form>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddMember;
