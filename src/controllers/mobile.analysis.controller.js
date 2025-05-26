const Analysis = require('../models/analysis.model');
const s3Service = require('../services/s3.service');
const AppError = require('../utils/error.utils');

const saveMobileParasiteAnalysis = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Analiz için bir görüntü gerekli', 400);
    }
    
    const userId = req.user.id;
    const imageBuffer = req.file.buffer;
    let results;
    
    // Gönderilen sonuçları parse et
    try {
      results = JSON.parse(req.body.results);
    } catch (error) {
      throw new AppError('Geçersiz sonuç formatı', 400);
    }
    
    // S3'e yükle
    const { key, url } = await s3Service.uploadFile(imageBuffer, `parasite-${Date.now()}.jpg`, 'analyses');
    
    // Analiz kaydı oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'Parasite',
      imageUrl: url,
      rawImageKey: key,
      location: req.body.location,
      notes: req.body.notes,
      parasiteResults: results,
      processingTimeMs: parseInt(req.body.processingTimeMs) || 0,
      processedOnMobile: true,
      modelName: req.body.modelName,
      modelVersion: req.body.modelVersion,
      deviceInfo: req.body.deviceInfo
    });
    
    await analysis.save();
    
    res.status(201).json({
      success: true,
      message: 'Mobil analiz başarıyla kaydedildi',
      analysisId: analysis._id
    });
  } catch (error) {
    next(error);
  }
};

const saveMobileMNISTAnalysis = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Analiz için bir görüntü gerekli', 400);
    }
    
    const userId = req.user.id;
    const imageBuffer = req.file.buffer;
    let results;
    
    // Gönderilen sonuçları parse et
    try {
      results = JSON.parse(req.body.results);
    } catch (error) {
      throw new AppError('Geçersiz sonuç formatı', 400);
    }
    
    // S3'e yükle
    const { key, url } = await s3Service.uploadFile(imageBuffer, `mnist-${Date.now()}.jpg`, 'analyses');
    
    // Analiz kaydı oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'MNIST',
      imageUrl: url,
      rawImageKey: key,
      notes: req.body.notes,
      digitResults: results,
      processingTimeMs: parseInt(req.body.processingTimeMs) || 0,
      processedOnMobile: true,
      modelName: req.body.modelName,
      modelVersion: req.body.modelVersion,
      deviceInfo: req.body.deviceInfo
    });
    
    await analysis.save();
    
    res.status(201).json({
      success: true,
      message: 'Mobil MNIST analizi başarıyla kaydedildi',
      analysisId: analysis._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveMobileParasiteAnalysis,
  saveMobileMNISTAnalysis
}; 