/**
 * AWS S3 konfigürasyonu
 */

// S3 yapılandırma nesnesi
const awsConfig = {
  // AWS bölgesi
  region: process.env.AWS_REGION || 'eu-central-1',
  
  // Kimlik bilgileri
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  
  // S3 bucket adı
  bucketName: process.env.S3_BUCKET_NAME || 'opca-images',
  
  // Ön imzalı URL'lerin geçerlilik süresi (saniye)
  signedUrlExpiration: parseInt(process.env.S3_SIGNED_URL_EXPIRATION || '3600', 10),
  
  // Dosya boyutu limitleri
  fileSizeLimits: {
    // Maksimum dosya boyutu (5MB)
    max: 5 * 1024 * 1024,
    // Minimum dosya boyutu (1KB)
    min: 1024
  },
  
  // İzin verilen MIME tipleri
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif'
  ],
  
  // Klasör yapısı
  folders: {
    PARASITES: 'parasites',
    DIGITS: 'digits',
    THUMBNAILS: 'thumbnails',
    TEMP: 'temp'
  },
  
  // Thumbnail ayarları
  thumbnails: {
    // Genişlik
    width: 300,
    // Yükseklik
    height: 300,
    // JPEG kalitesi (0-100)
    quality: 80,
    // Resize fit modu
    fit: 'inside'
  }
};

module.exports = awsConfig; 