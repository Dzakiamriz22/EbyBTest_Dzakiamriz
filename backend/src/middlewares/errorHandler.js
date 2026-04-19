function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Route ${req.originalUrl} tidak ditemukan` });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
