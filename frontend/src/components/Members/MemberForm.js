//frontend\src\components\Members\MemberForm.js
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addMember } from "../../services/api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";

function MemberForm() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    baptismDate: "",
    maritalStatus: "",
    spouse: "",
    children: "",
    occupation: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Você precisa estar logado para cadastrar membros");
      }

      const response = await addMember(token, formData);
      console.log("Membro cadastrado:", response);

      setSuccess("Membro cadastrado com sucesso!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        birthDate: "",
        baptismDate: "",
        maritalStatus: "",
        spouse: "",
        children: "",
        occupation: "",
        notes: "",
      });
    } catch (err) {
      console.error("Erro ao cadastrar membro:", err);
      setError(err.message || "Erro ao cadastrar membro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cadastrar Novo Membro
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Nascimento"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Batismo"
                name="baptismDate"
                type="date"
                value={formData.baptismDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado Civil"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Cônjuge"
                name="spouse"
                value={formData.spouse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Filhos"
                name="children"
                value={formData.children}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profissão"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Cadastrar Membro"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default MemberForm;
