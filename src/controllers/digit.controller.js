const Digit = require('../models/digit.model');

/**
 * Tüm rakam bilgilerini getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAllDigits = async (req, res, next) => {
  try {
    const digits = await Digit.find().sort({ value: 1 });
    
    res.status(200).json({
      success: true,
      count: digits.length,
      digits
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rakam bilgisini değerine göre getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getDigitByValue = async (req, res, next) => {
  try {
    const value = parseInt(req.params.value);
    
    if (isNaN(value) || value < 0 || value > 9) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir rakam değeri giriniz (0-9)'
      });
    }
    
    const digit = await Digit.findOne({ value });
    
    if (!digit) {
      return res.status(404).json({
        success: false,
        message: 'Rakam bilgisi bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      digit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Yeni rakam bilgisi ekler (Sadece admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.createDigit = async (req, res, next) => {
  try {
    // Sadece admin erişimi kontrol et
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }
    
    // Rakam zaten var mı kontrol et
    const existingDigit = await Digit.findOne({ value: req.body.value });
    
    if (existingDigit) {
      return res.status(400).json({
        success: false,
        message: 'Bu değerde bir rakam zaten mevcut'
      });
    }
    
    // Rakamı oluştur
    const digit = new Digit(req.body);
    await digit.save();
    
    res.status(201).json({
      success: true,
      message: 'Rakam bilgisi başarıyla eklendi',
      digit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rakam bilgisini günceller (Sadece admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.updateDigit = async (req, res, next) => {
  try {
    // Sadece admin erişimi kontrol et
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      });
    }
    
    const value = parseInt(req.params.value);
    
    if (isNaN(value) || value < 0 || value > 9) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir rakam değeri giriniz (0-9)'
      });
    }
    
    // Value değeri değiştirilemez
    if (req.body.value !== undefined && req.body.value !== value) {
      return res.status(400).json({
        success: false,
        message: 'Rakam değeri (value) değiştirilemez'
      });
    }
    
    const digit = await Digit.findOneAndUpdate(
      { value },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!digit) {
      return res.status(404).json({
        success: false,
        message: 'Rakam bilgisi bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Rakam bilgisi başarıyla güncellendi',
      digit
    });
  } catch (error) {
    next(error);
  }
}; 