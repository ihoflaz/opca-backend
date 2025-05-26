const modelService = require('../services/model.service');
const AppError = require('../utils/error.utils');

/**
 * Mevcut model versiyonlarını ve güncelleme bilgilerini listeler
 * (Modeller uygulama içinde gömülü olduğundan, sadece versiyon ve güncelleme bilgisi sağlanır)
 */
const getAvailableModels = async (req, res, next) => {
  try {
    const models = await modelService.getAvailableModels();
    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Belirli bir modelin metadata bilgilerini döndürür
 * (Modeller uygulama içinde gömülü olduğundan, sadece metadata ve güncelleme kontrolü yapılır)
 */
const getModelMetadata = async (req, res, next) => {
  try {
    const { category, name, version } = req.params;
    
    // Kategori kontrolü
    if (!['parasite', 'mnist'].includes(category)) {
      throw new AppError('Geçersiz model kategorisi. Desteklenen kategoriler: parasite, mnist', 400);
    }
    
    // Model metadata bilgilerini al
    const metadata = await modelService.getModelMetadata(category, name, version);
    
    // İstemciye metadata bilgilerini döndür
    res.status(200).json({
      success: true,
      data: {
        ...metadata,
        isLatestVersion: await modelService.isLatestVersion(category, name, version)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Model güncellemesi gerekip gerekmediğini kontrol eder
 */
const checkModelUpdate = async (req, res, next) => {
  try {
    const { category, name, version } = req.params;
    
    // Kategori kontrolü
    if (!['parasite', 'mnist'].includes(category)) {
      throw new AppError('Geçersiz model kategorisi. Desteklenen kategoriler: parasite, mnist', 400);
    }
    
    // Güncelleme kontrolü yap
    const updateInfo = await modelService.checkModelUpdate(category, name, version);
    
    res.status(200).json({
      success: true,
      data: updateInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableModels,
  getModelMetadata,
  checkModelUpdate
}; 