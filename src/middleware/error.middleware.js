/**
 * Hata yakalama middleware'i
 * Uygulama genelinde oluşan hataları yakalar ve tutarlı bir hata yanıtı döndürür
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Bu ${field} zaten kullanılıyor. Lütfen başka bir ${field} deneyin.`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    const message = `Geçersiz ${err.path}: ${err.value}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new Error('Geçersiz token. Lütfen tekrar giriş yapın.');
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error = new Error('Token süresi doldu. Lütfen tekrar giriş yapın.');
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

module.exports = errorHandler; 