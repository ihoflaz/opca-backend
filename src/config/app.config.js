/**
 * Uygulama genel konfigürasyonu
 */

// Uygulama ortamı
const environment = process.env.NODE_ENV || 'development';

// Uygulama konfigürasyon nesnesi
const appConfig = {
  // Ortam adı
  env: environment,
  
  // Geliştirme ortamı mı?
  isDevelopment: environment === 'development',
  
  // Üretim ortamı mı?
  isProduction: environment === 'production',
  
  // Test ortamı mı?
  isTest: environment === 'test',
  
  // Sunucu portu
  port: parseInt(process.env.PORT || '5002', 10),
  
  // API endpoint ana URL
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5002',
  
  // API versiyonu
  apiVersion: process.env.API_VERSION || 'v1',
  
  // CORS konfigürasyonu
  cors: {
    // İzin verilen kaynaklar (origin)
    origin: process.env.CORS_ORIGIN || '*',
    // İzin verilen metotlar
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // İzin verilen headerlar
    allowedHeaders: 'Content-Type,Authorization',
    // Kimlik bilgileri (credentials) kabul edilsin mi?
    credentials: true
  },
  
  // Loglama konfigürasyonu
  logging: {
    // Log seviyesi
    level: environment === 'production' ? 'info' : 'debug',
    // Log formatı
    format: environment === 'production' ? 'json' : 'pretty',
    // Konsola log yazılsın mı?
    console: true,
    // Dosyaya log yazılsın mı?
    file: environment === 'production'
  },
  
  // Rate limiting konfigürasyonu
  rateLimit: {
    // Pencere süresi (15 dakika)
    windowMs: 15 * 60 * 1000,
    // Maksimum istek sayısı
    max: 100,
    // Standardize edilmiş header'lar kullanılsın mı?
    standardHeaders: true,
    // X-RateLimit header'ları eklensin mi?
    legacyHeaders: false
  }
};

module.exports = appConfig; 