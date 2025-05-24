const s3Service = require('../services/s3.service');

/**
 * Görüntü yükleme ve S3'e kaydetme
 * @param {Object} req Express request nesnesi
 * @param {Object} res Express response nesnesi
 * @param {Function} next Sonraki middleware'e geçiş fonksiyonu
 */
exports.uploadImage = async (req, res, next) => {
  try {
    // Middleware'den gelen dosyayı kontrol et
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir görüntü dosyası yükleyin'
      });
    }

    // Dosya bilgileri
    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const folder = req.body.folder || 'images'; // Varsayılan klasör

    // S3'e yükle
    const uploadResult = await s3Service.uploadFile(fileBuffer, fileName, folder);

    res.status(201).json({
      success: true,
      message: 'Görüntü başarıyla yüklendi',
      data: uploadResult
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Çoklu görüntü yükleme ve S3'e kaydetme
 * @param {Object} req Express request nesnesi
 * @param {Object} res Express response nesnesi
 * @param {Function} next Sonraki middleware'e geçiş fonksiyonu
 */
exports.uploadMultipleImages = async (req, res, next) => {
  try {
    // Middleware'den gelen dosyaları kontrol et
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen en az bir görüntü dosyası yükleyin'
      });
    }

    const folder = req.body.folder || 'images'; // Varsayılan klasör
    const uploadResults = [];

    // Her dosyayı S3'e yükle
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `${Date.now()}-${file.originalname}`;
      
      const result = await s3Service.uploadFile(fileBuffer, fileName, folder);
      uploadResults.push(result);
    }

    res.status(201).json({
      success: true,
      message: `${uploadResults.length} görüntü başarıyla yüklendi`,
      data: uploadResults
    });
  } catch (error) {
    next(error);
  }
};

/**
 * S3'ten dosyayı sil
 * @param {Object} req Express request nesnesi
 * @param {Object} res Express response nesnesi
 * @param {Function} next Sonraki middleware'e geçiş fonksiyonu
 */
exports.deleteImage = async (req, res, next) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Dosya anahtarı (key) belirtilmelidir'
      });
    }

    // S3'ten dosyayı sil
    await s3Service.deleteFile(key);

    res.status(200).json({
      success: true,
      message: 'Dosya başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
}; 