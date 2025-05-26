/**
 * Özel hata sınıfı
 * Operasyonel hataları (uygulama tarafından yakalanması beklenen hatalar) işaretlemek için kullanılır
 */
class AppError extends Error {
  /**
   * AppError constructor
   * @param {string} message - Hata mesajı
   * @param {number} statusCode - HTTP durum kodu
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Bu bir operasyonel hatadır
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError; 