// backend/utils/fileHelper.js
const fs = require("fs").promises;
const path = require("path");

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
  }
};

const getFileNameFromUrl = (url) => {
  if (!url) return null;
  try {
    return url.split("/").pop();
  } catch (error) {
    console.error("Erro ao extrair nome do arquivo:", error);
    return null;
  }
};

module.exports = {
  deleteFile,
  getFileNameFromUrl,
};
