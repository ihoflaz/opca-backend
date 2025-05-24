/**
 * JWT (JSON Web Token) konfigürasyonu
 */

// JWT yapılandırma nesnesi
const jwtConfig = {
  // JWT gizli anahtarı
  secret: process.env.JWT_SECRET || 'supersecret_opca_development_key',
  
  // Access token süresi (1 saat)
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h',
  
  // Refresh token süresi (7 gün)
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  
  // Token türleri
  tokenTypes: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  },
  
  // Algoritma
  algorithm: 'HS256',
  
  // İsteğe bağlı alanlar
  options: {
    // Yayıncı
    issuer: 'opca-backend',
    // Hedef kitle
    audience: 'opca-client',
    // Konu
    subject: 'authentication'
  }
};

module.exports = jwtConfig; 