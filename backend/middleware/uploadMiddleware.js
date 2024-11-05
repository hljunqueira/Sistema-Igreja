// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Diretório para salvar os arquivos
const uploadDir = path.join(__dirname, "..", "uploads");

// Configuração do armazenamento local temporário
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.includes(".")
      ? path.extname(file.originalname)
      : ".jpg"; // Default para fotos da webcam
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Validação de arquivos
const fileFilter = (req, file, cb) => {
  // Aceitar tanto arquivos enviados quanto blobs da webcam
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de arquivo inválido. Apenas JPG, PNG e WebP são permitidos."
      ),
      false
    );
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
});

// Middleware para lidar com o upload
const handleUpload = (req, res, next) => {
  upload.single("profile_image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: "Erro no upload do arquivo",
        error: err.message,
      });
    }
    next();
  });
};

module.exports = { handleUpload };
