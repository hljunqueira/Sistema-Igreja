const multer = require("multer");
const path = require("path");

// No início do arquivo, adicione:
const uploadDir = path.join(__dirname, "..", "uploads");

// Configuração do armazenamento local temporário
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Definindo destino do arquivo:", uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("Definindo nome do arquivo");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Validação de arquivos
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de arquivo inválido. Apenas JPG e PNG são permitidos."
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
  console.log("Iniciando handleUpload");
  upload.single("profile_image")(req, res, (err) => {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(400).json({
        message: "Erro no upload do arquivo",
        error: err.message,
      });
    }
    console.log("Upload bem-sucedido, arquivo:", req.file);
    next();
  });
};

module.exports = { handleUpload };
