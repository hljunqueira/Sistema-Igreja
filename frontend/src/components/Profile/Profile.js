// src/components/Profile/Profile.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Avatar,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    birth_date: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    notifications_preferences: {
      email: true,
      push: true,
    },
    profile_image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Função para buscar os dados do usuário
  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/user/profile");
      setFormData((prev) => ({
        ...prev,
        ...response.data,
        address: {
          street: response.data.address?.street || "",
          city: response.data.address?.city || "",
          state: response.data.address?.state || "",
          zipCode: response.data.address?.zipCode || "",
        },
        notifications_preferences: {
          email: response.data.notifications_preferences?.email ?? true,
          push: response.data.notifications_preferences?.push ?? true,
        },
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        birth_date: response.data.birth_date || "",
        profile_image_url: response.data.profile_image_url || "",
      }));
    } catch (err) {
      setError("Erro ao carregar dados do usuário");
      showSnackbar("Erro ao carregar dados do usuário", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleNotificationPreferenceChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      notifications_preferences: {
        ...prev.notifications_preferences,
        [type]: !prev.notifications_preferences[type],
      },
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setSaving(true);
      const response = await api.post("/user/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        profile_image_url: response.data.imageUrl,
      }));

      showSnackbar("Foto de perfil atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      showSnackbar("Erro ao atualizar foto de perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put("/user/profile", formData);
      setFormData((prev) => ({
        ...prev,
        ...response.data,
        address: {
          street: response.data.address?.street || "",
          city: response.data.address?.city || "",
          state: response.data.address?.state || "",
          zipCode: response.data.address?.zipCode || "",
        },
        notifications_preferences: {
          email: response.data.notifications_preferences?.email ?? true,
          push: response.data.notifications_preferences?.push ?? true,
        },
      }));
      showSnackbar("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      showSnackbar("Erro ao atualizar perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Perfil do Usuário
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                src={formData.profile_image_url}
                sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
              />
              <Button variant="outlined" component="label">
                Alterar Foto
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {formData.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.user_type || "membro"}
              </Typography>
              <Button
                variant="text"
                component={Link}
                to="/change-password"
                sx={{ mt: 2 }}
              >
                Alterar Senha
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informações Pessoais
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      name="name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Data de Nascimento"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      name="birth_date"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Endereço
                    </Typography>
                    <TextField
                      fullWidth
                      label="Rua"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      name="street"
                    />
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      name="city"
                    />
                    <TextField
                      fullWidth
                      label="Estado"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      name="state"
                    />
                    <TextField
                      fullWidth
                      label="CEP"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange}
                      name="zipCode"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Preferências de Notificação
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notifications_preferences.email}
                          onChange={() =>
                            handleNotificationPreferenceChange("email")
                          }
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notifications_preferences.push}
                          onChange={() =>
                            handleNotificationPreferenceChange("push")
                          }
                        />
                      }
                      label="Notificações Push"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Salvando..." : "Salvar"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Profile;
