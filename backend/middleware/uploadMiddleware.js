// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const rateLimit = require("express-rate-limit");

// Configuração do armazenamento Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Validação de arquivos
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Formato de arquivo inválido. Apenas JPG e PNG são permitidos.")
    );
  }
};

// Configuração do Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Limitação de taxa para uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // limite de 5 uploads por 15 minutos
});

// Middleware para lidar com o upload
const handleUpload = (req, res, next) => {
  uploadLimiter(req, res, () => {
    upload.single("profile_image")(req, res, (err) => {
      // Corrigido para 'profile_image'
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: "Erro no upload do arquivo",
          error: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          message: "Erro no upload",
          error: err.message,
        });
      }
      next();
    });
  });
};

// Exportando os middlewares
module.exports = {
  handleUpload,
  upload, // Se precisar usar o upload diretamente em outros lugares
};
