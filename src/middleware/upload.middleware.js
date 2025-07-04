const multer = require('multer');
const path = require('path');

// Geçici depolama için multer konfigürasyonu
const storage = multer.memoryStorage();

// Dosya filtreleme (sadece görseller)
const fileFilter = (req, file, cb) => {
  // İzin verilen mimetype'lar
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece JPEG, JPG ve PNG formatlarına izin verilmektedir.'), false);
  }
};

// Multer konfigürasyonu
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maksimum dosya boyutu
    files: 1 // Tek seferde maksimum 1 dosya
  },
  fileFilter: fileFilter
});

// Tek dosya yükleme middleware'i
exports.uploadSingle = upload.single('image');

// Çoklu dosya yükleme middleware'i (maksimum 5 dosya)
exports.uploadMultiple = upload.array('images', 5);

// Hata yakalama middleware'i
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer hatası (dosya boyutu aşımı vb.)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dosya boyutu 10MB sınırını aşıyor.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Tek seferde en fazla 1 dosya yüklenebilir.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Yükleme hatası: ${err.message}`
    });
  } else if (err) {
    // Diğer hatalar
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
}; 