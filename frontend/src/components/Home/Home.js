import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, logout, updateProfileImage } = useAuth(); // Obtém informações do usuário do contexto de autenticação
  const navigate = useNavigate(); // Inicializa o useNavigate
  const [imageFile, setImageFile] = useState(null); // Estado para armazenar a nova imagem

  // Função para lidar com o clique na imagem de perfil
  const handleProfileClick = () => {
    if (user) {
      navigate("/profile"); // Redireciona para a página de perfil
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    logout(); // Chama a função de logout
    navigate("/login"); // Redireciona para a página de login
  };

  // Função para lidar com o upload da nova imagem
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Define a nova imagem
      try {
        await updateProfileImage(file); // Chama a função para atualizar a imagem de perfil
      } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
        // Aqui você pode adicionar um snackbar ou alerta para o usuário
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Botão para carregar a imagem de perfil */}
          <label htmlFor="profile-image-upload" style={{ cursor: "pointer" }}>
            <Avatar
              onClick={handleProfileClick} // Adiciona o manipulador de clique ao Avatar
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : user?.profile_image_url || "/default-avatar.png"
              } // URL da imagem de perfil ou imagem padrão
              alt={user?.name || "Usuário"}
              sx={{ width: 56, height: 56, mr: 2 }} // Tamanho do Avatar
            />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }} // Oculta o input de arquivo
          />
          <Typography variant="h4" gutterBottom>
            Bem-vindo, {user?.name || "Visitante"}!
          </Typography>
        </Box>

        {/* Botão de Logout */}
        {user && (
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Sair
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Próximos Eventos</Typography>
            {/* Adicionar conteúdo relevante aqui */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Avisos Importantes</Typography>
            {/* Adicionar conteúdo relevante aqui */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
