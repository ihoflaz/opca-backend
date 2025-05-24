const analysisService = require('../services/analysis.service');

/**
 * Parazit analizi yapar
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.analyzeParasite = async (req, res, next) => {
  try {
    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Analiz için bir görüntü yüklemelisiniz'
      });
    }

    // Analiz yap
    const result = await analysisService.createParasiteAnalysis(
      {
        location: req.body.location,
        notes: req.body.notes
      },
      req.file.buffer,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      analysisId: result.analysisId,
      results: result.results,
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      processingTimeMs: result.processingTimeMs,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * MNIST rakam analizi yapar
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.analyzeMNIST = async (req, res, next) => {
  try {
    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Analiz için bir görüntü yüklemelisiniz'
      });
    }

    // Analiz yap
    const result = await analysisService.createMNISTAnalysis(
      {
        notes: req.body.notes
      },
      req.file.buffer,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      analysisId: result.analysisId,
      results: result.results,
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      processingTimeMs: result.processingTimeMs,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mobil cihazda işlenmiş parazit analiz sonuçlarını kaydeder
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.saveParasiteAnalysisFromMobile = async (req, res, next) => {
  try {
    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Analiz için bir görüntü yüklemelisiniz'
      });
    }

    // Sonuç kontrolü
    if (!req.body.results || !Array.isArray(JSON.parse(req.body.results))) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli analiz sonuçları göndermelisiniz'
      });
    }

    // Analiz sonuçlarını kaydet
    const result = await analysisService.saveMobileParasiteAnalysis(
      {
        location: req.body.location,
        notes: req.body.notes,
        results: JSON.parse(req.body.results),
        processingTimeMs: req.body.processingTimeMs,
        modelInfo: {
          modelName: req.body.modelName,
          modelVersion: req.body.modelVersion,
          deviceInfo: req.body.deviceInfo
        }
      },
      req.file.buffer,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      analysisId: result.analysisId,
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mobil cihazda işlenmiş MNIST analiz sonuçlarını kaydeder
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.saveMNISTAnalysisFromMobile = async (req, res, next) => {
  try {
    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Analiz için bir görüntü yüklemelisiniz'
      });
    }

    // Sonuç kontrolü
    if (!req.body.results || !Array.isArray(JSON.parse(req.body.results))) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli analiz sonuçları göndermelisiniz'
      });
    }

    // Analiz sonuçlarını kaydet
    const result = await analysisService.saveMobileMNISTAnalysis(
      {
        notes: req.body.notes,
        results: JSON.parse(req.body.results),
        processingTimeMs: req.body.processingTimeMs,
        modelInfo: {
          modelName: req.body.modelName,
          modelVersion: req.body.modelVersion,
          deviceInfo: req.body.deviceInfo
        }
      },
      req.file.buffer,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      analysisId: result.analysisId,
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Analiz sonuçlarını getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAnalysisResult = async (req, res, next) => {
  try {
    const analysis = await analysisService.getAnalysisById(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    if (error.message === 'Analiz bulunamadı') {
      return res.status(404).json({
        success: false,
        message: 'Analiz bulunamadı'
      });
    }
    next(error);
  }
};

/**
 * Kullanıcının analiz geçmişini getirir
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      processedOnMobile: req.query.processedOnMobile === 'true'
    };

    const result = await analysisService.getUserAnalyses(req.user.userId, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}; 