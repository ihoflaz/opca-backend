const Parasite = require('../models/parasite.model');

/**
 * Tüm parazit bilgilerini getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAllParasites = async (req, res, next) => {
  try {
    const parasites = await Parasite.find().select('type name description treatment preventionMeasures imageUrls');
    
    res.status(200).json({
      success: true,
      count: parasites.length,
      parasites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Parazit bilgisini tipine göre getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getParasiteByType = async (req, res, next) => {
  try {
    const parasite = await Parasite.findOne({ type: req.params.type });
    
    if (!parasite) {
      return res.status(404).json({
        success: false,
        message: 'Parazit bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      parasite
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Yeni parazit bilgisi ekler (Sadece admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.createParasite = async (req, res, next) => {
  try {
    // Sadece admin erişimi kontrol et
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }
    
    // Parazit zaten var mı kontrol et
    const existingParasite = await Parasite.findOne({ type: req.body.type });
    
    if (existingParasite) {
      return res.status(400).json({
        success: false,
        message: 'Bu tipte bir parazit zaten mevcut'
      });
    }
    
    // Yeni parazit oluştur
    const parasite = new Parasite(req.body);
    await parasite.save();
    
    res.status(201).json({
      success: true,
      message: 'Parazit bilgisi başarıyla eklendi',
      parasite
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Parazit bilgisini günceller (Sadece admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.updateParasite = async (req, res, next) => {
  try {
    // Sadece admin erişimi kontrol et
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }
    
    const parasite = await Parasite.findOneAndUpdate(
      { type: req.params.type },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!parasite) {
      return res.status(404).json({
        success: false,
        message: 'Parazit bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Parazit bilgisi başarıyla güncellendi',
      parasite
    });
  } catch (error) {
    next(error);
  }
}; 