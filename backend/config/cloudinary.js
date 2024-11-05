// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do armazenamento no Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images", // Pasta onde as imagens serão armazenadas
    allowed_formats: ["jpg", "jpeg", "png"], // Formatos permitidos
    transformation: [
      { width: 500, height: 500, crop: "limit" }, // Limitar o tamanho da imagem
      { quality: "auto" }, // Qualidade automática
      { fetch_format: "auto" }, // Formato automático
    ],
  },
});

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  // Filtro de arquivos para garantir que apenas imagens sejam enviadas
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas imagens são permitidas!"), false);
    }
    cb(null, true);
  },
});

// Exportando o Cloudinary e o middleware de upload
module.exports = {
  cloudinary,
  upload,
};
