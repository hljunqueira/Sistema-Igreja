// frontend/src/components/Members/EditMember.js
import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    baptismDate: "",
    observations: "",
    // frontend/src/components/Members/EditMember.js (continuação)
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await api.get(`/members/${id}`);
        const memberData = response.data;

        // Formatando as datas para o formato aceito pelo input type="date"
        setMember({
          name: memberData.name || "",
          email: memberData.email || "",
          phone: memberData.phone || "",
          address: memberData.address || "",
          birthDate: memberData.birth_date
            ? memberData.birth_date.split("T")[0]
            : "",
          baptismDate: memberData.baptism_date
            ? memberData.baptism_date.split("T")[0]
            : "",
          observations: memberData.observations || "",
        });
      } catch (err) {
        setError("Erro ao carregar dados do membro");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/members/${id}`, member);
      setSuccessMessage("Membro atualizado com sucesso");
      setTimeout(() => {
        navigate("/members");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar membro");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Membro
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

          <Box sx={{ mt: 3, mb: 2, display: "flex", gap: 2 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => navigate("/members")}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : "Salvar Alterações"}
            </Button>
          </Box>
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

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EditMember;
