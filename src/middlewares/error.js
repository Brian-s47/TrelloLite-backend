// src/middlewares/error.js
export function errorHandler(err, req, res, next) {
  console.error("🔥 Error capturado:", err);

  // Si ya tiene status, úsalo, si no 500
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message || "Error interno del servidor",
      details: err.details || null,
    },
  });
}
