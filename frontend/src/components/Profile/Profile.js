import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
  Paper,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (user) {
      console.log("Dados do usuário carregados:", user);
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      setPreviewImage(user.profileImageUrl);
    }
  }, [user]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.email.trim()) errors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email inválido";

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
  }, [formData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Arquivo muito grande. O tamanho máximo é 5MB.",
          severity: "error",
        });
        return;
      }
      console.log("Nova imagem selecionada:", file);
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        if (formData.currentPassword)
          formDataToSend.append("currentPassword", formData.currentPassword);
        if (formData.newPassword)
          formDataToSend.append("newPassword", formData.newPassword);
        if (profileImage) formDataToSend.append("profileImage", profileImage);

        const updatedUser = await updateProfile(formDataToSend);

        if (updatedUser) {
          setSnackbar({
            open: true,
            message: "Perfil atualizado com sucesso",
            severity: "success",
          });
          console.log("Perfil atualizado:", updatedUser);
          setFormData((prev) => ({ ...prev, ...updatedUser }));
          setPreviewImage(updatedUser.profileImageUrl);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erro ao atualizar perfil",
          severity: "error",
        });
        console.error("Erro ao atualizar perfil:", error);
      }
    } else {
      setSnackbar({
        open: true,
        message: "Verifique os erros no formulário",
        severity: "error",
      });
      console.error("Erros no formulário:", errors);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Perfil
      </Typography>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!validateForm().name}
              helperText={validateForm().name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              error={!!validateForm().email}
              helperText={validateForm().email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Senha atual"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              error={!!validateForm().currentPassword}
              helperText={validateForm().currentPassword}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nova senha"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              error={!!validateForm().newPassword}
              helperText={validateForm().newPassword}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={!!validateForm().confirmPassword}
              helperText={validateForm().confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar
                src={previewImage}
                sx={{ width: 100, height: 100, mb: 2 }}
                alt={formData.name}
              />
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="profileImage">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Escolher Imagem
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Atualizar perfil"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Profile;
