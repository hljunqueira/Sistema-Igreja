// frontend/src/utils/fileHelper.js
import { api } from "../services/api";

export const deleteOldProfileImage = async (oldImageUrl) => {
  if (!oldImageUrl) return;

  try {
    // Extrai o nome do arquivo da URL
    const fileName = oldImageUrl.split("/").pop();

    // Verifica se é uma URL válida e se pertence ao domínio da aplicação
    if (!fileName || !oldImageUrl.includes(process.env.REACT_APP_API_URL)) {
      return;
    }

    await api.delete(`/auth/profile/image/${fileName}`);
  } catch (error) {
    console.error("Erro ao deletar imagem antiga:", error);
  }
};

export const getFileNameFromUrl = (url) => {
  if (!url) return null;
  try {
    return url.split("/").pop();
  } catch (error) {
    console.error("Erro ao extrair nome do arquivo:", error);
    return null;
  }
};
