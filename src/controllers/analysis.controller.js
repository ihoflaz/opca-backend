const analysisService = require('../services/analysis.service');
const cacheMiddleware = require('../middleware/cache.middleware');

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
      req.user._id
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
      req.user._id
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
        modelName: req.body.modelName,
        modelVersion: req.body.modelVersion,
        deviceInfo: req.body.deviceInfo
      },
      req.file.buffer,
      req.user._id
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
        modelName: req.body.modelName,
        modelVersion: req.body.modelVersion,
        deviceInfo: req.body.deviceInfo
      },
      req.file.buffer,
      req.user._id
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
    const analysis = await analysisService.getAnalysisById(req.params.id, req.user._id);

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
      endDate: req.query.endDate
    };

    // processedOnMobile filtresi sadece açıkça belirtildiğinde uygulanır
    if (req.query.processedOnMobile !== undefined) {
      options.processedOnMobile = req.query.processedOnMobile === 'true';
    }

    const result = await analysisService.getUserAnalyses(req.user._id, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Birden fazla analiz sonucunu toplu olarak yükler (offline mod senkronizasyonu için)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.saveBatchAnalysisResults = async (req, res, next) => {
  try {
    // Veri kontrolü
    if (!req.body.analyses || !Array.isArray(req.body.analyses) || req.body.analyses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli analiz sonuçları dizisi göndermelisiniz'
      });
    }
    
    const results = [];
    const errors = [];
    
    // Her bir analizi işle
    for (const analysis of req.body.analyses) {
      try {
        let result;
        
        // Analiz tipine göre işleme
        if (analysis.type === 'Parasite') {
          result = await analysisService.saveMobileParasiteAnalysis(
            {
              localId: analysis.localId,
              location: analysis.location,
              notes: analysis.notes,
              results: analysis.results,
              processingTimeMs: analysis.processingTimeMs,
              modelName: analysis.modelName,
              modelVersion: analysis.modelVersion,
              deviceInfo: analysis.deviceInfo,
              createdAt: analysis.createdAt
            },
            Buffer.from(analysis.imageBase64, 'base64'),
            req.user._id
          );
        } else if (analysis.type === 'MNIST') {
          result = await analysisService.saveMobileMNISTAnalysis(
            {
              localId: analysis.localId,
              notes: analysis.notes,
              results: analysis.results,
              processingTimeMs: analysis.processingTimeMs,
              modelName: analysis.modelName,
              modelVersion: analysis.modelVersion,
              deviceInfo: analysis.deviceInfo,
              createdAt: analysis.createdAt
            },
            Buffer.from(analysis.imageBase64, 'base64'),
            req.user._id
          );
        } else {
          throw new Error(`Geçersiz analiz tipi: ${analysis.type}`);
        }
        
        // Sonucu diziye ekle
        results.push({
          localId: analysis.localId,
          serverId: result.analysisId,
          status: 'success'
        });
        
        // Kullanıcıya ait önbelleği temizle
        cacheMiddleware.clearUserAnalysisCache(req.user._id);
        
      } catch (error) {
        // Hata durumunda hata bilgisini kaydet
        errors.push({
          localId: analysis.localId,
          status: 'error',
          message: error.message
        });
      }
    }
    
    // Sonuçları gönder
    res.status(200).json({
      success: true,
      results: [...results, ...errors],
      successCount: results.length,
      errorCount: errors.length,
      totalCount: req.body.analyses.length
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Tüm analizleri getirir (Admin Dashboard için)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAllAnalyses = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      userId: req.query.userId,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    // processedOnMobile filtresi sadece açıkça belirtildiğinde uygulanır
    if (req.query.processedOnMobile !== undefined) {
      options.processedOnMobile = req.query.processedOnMobile === 'true';
    }

    const result = await analysisService.getAllAnalyses(options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Analiz istatistikleri (Admin Dashboard için)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Sonraki middleware
 */
exports.getAnalysisStats = async (req, res, next) => {
  try {
    const stats = await analysisService.getAnalysisStats();

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
}; 