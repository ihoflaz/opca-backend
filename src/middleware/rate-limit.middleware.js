const rateLimit = require('express-rate-limit');

/**
 * Auth API istekleri için rate limiter
 * Login ve register gibi istekleri sınırlar
 */
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10, // IP başına 10 istek
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true, // Rate limit bilgisini yanıt başlıklarına ekler
  legacyHeaders: false, // X-RateLimit başlıklarını kullanmaz
});

/**
 * Genel API istekleri için rate limiter
 * Tüm genel istekleri sınırlar
 */
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 60, // IP başına dakikada 60 istek (saniyede 1)
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Dosya yükleme istekleri için rate limiter
 * Dosya yükleme isteklerini daha sıkı sınırlar
 */
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 10, // IP başına dakikada 10 istek
  message: {
    success: false,
    message: 'Çok fazla dosya yükleme isteği, lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 