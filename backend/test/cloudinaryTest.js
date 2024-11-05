// backend/tests/cloudinaryTest.js
require("dotenv").config();
const { cloudinary } = require("../config/cloudinary");

async function testCloudinaryConnection() {
  try {
    // Tenta acessar informações da conta
    const result = await cloudinary.api.usage();
    console.log("Conexão com Cloudinary estabelecida com sucesso!");
    console.log("Informações da conta:", result);
    return true;
  } catch (error) {
    console.error("Erro ao conectar com Cloudinary:", error);
    return false;
  }
}

testCloudinaryConnection();
