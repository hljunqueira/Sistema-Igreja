import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

function Profile() {
  const { user, updateProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = "Nome é obrigatório";
    if (!formData.email) errors.email = "Email é obrigatório";

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        errors.newPassword = "A nova senha deve ter no mínimo 6 caracteres";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "As senhas não conferem";
      }
      if (!formData.currentPassword) {
        errors.currentPassword =
          "Senha atual é obrigatória para alterar a senha";
      }
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        const success = await updateProfile({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
        if (success) {
          setSnackbar({
            open: true,
            message: "Perfil atualizado com sucesso!",
            severity: "success",
          });
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Erro ao atualizar perfil",
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
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Perfil do Usuário
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Alterar Senha
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha Atual"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!formErrors.currentPassword}
                helperText={formErrors.currentPassword}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={!!formErrors.newPassword}
                helperText={formErrors.newPassword}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Nova Senha"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
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

export default Profile;
