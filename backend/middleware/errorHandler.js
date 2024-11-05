// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Arquivo muito grande. Tamanho máximo permitido: 5MB",
      });
    }
  }

  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};

module.exports = errorHandler;
