const Analysis = require('../models/analysis.model');
const s3Service = require('./s3.service');
const aiService = require('./ai.service');

/**
 * Parazit analizi oluştur
 * @param {Object} data - Analiz verileri
 * @param {Buffer} imageBuffer - Görüntü buffer'ı
 * @param {String} userId - Kullanıcı ID
 * @returns {Object} - Analiz sonuçları
 */
exports.createParasiteAnalysis = async (data, imageBuffer, userId) => {
  try {
    // AI analizi yap
    const { results, processingTimeMs } = await aiService.analyzeParasite(imageBuffer);
    
    // S3'e yükle
    const fileName = `parasite-${Date.now()}.jpg`;
    const uploadResult = await s3Service.uploadFile(imageBuffer, fileName, 'parasites');
    
    // Analiz kaydını oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'Parasite',
      imageUrl: uploadResult.url,
      rawImageKey: uploadResult.key,
      processedImageKey: uploadResult.thumbnailKey,
      location: data.location || null,
      notes: data.notes || null,
      parasiteResults: results,
      processingTimeMs
    });
    
    await analysis.save();
    
    return {
      analysisId: analysis._id,
      results,
      imageUrl: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      processingTimeMs
    };
  } catch (error) {
    console.error('Parasite analysis error:', error);
    throw new Error('Parazit analizi yapılırken bir hata oluştu');
  }
};

/**
 * MNIST rakam analizi oluştur
 * @param {Object} data - Analiz verileri
 * @param {Buffer} imageBuffer - Görüntü buffer'ı
 * @param {String} userId - Kullanıcı ID
 * @returns {Object} - Analiz sonuçları
 */
exports.createMNISTAnalysis = async (data, imageBuffer, userId) => {
  try {
    // AI analizi yap
    const { results, processingTimeMs } = await aiService.analyzeMNIST(imageBuffer);
    
    // S3'e yükle
    const fileName = `mnist-${Date.now()}.jpg`;
    const uploadResult = await s3Service.uploadFile(imageBuffer, fileName, 'digits');
    
    // Analiz kaydını oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'MNIST',
      imageUrl: uploadResult.url,
      rawImageKey: uploadResult.key,
      processedImageKey: uploadResult.thumbnailKey,
      notes: data.notes || null,
      digitResults: results,
      processingTimeMs
    });
    
    await analysis.save();
    
    return {
      analysisId: analysis._id,
      results,
      imageUrl: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      processingTimeMs
    };
  } catch (error) {
    console.error('MNIST analysis error:', error);
    throw new Error('Rakam analizi yapılırken bir hata oluştu');
  }
};

/**
 * Mobil cihazda işlenmiş parazit analiz sonuçlarını kaydet
 * @param {Object} data - Analiz verileri ve sonuçları
 * @param {Buffer} imageBuffer - Görüntü buffer'ı
 * @param {String} userId - Kullanıcı ID
 * @returns {Object} - Analiz sonuçları
 */
exports.saveMobileParasiteAnalysis = async (data, imageBuffer, userId) => {
  try {
    // S3'e yükle
    const fileName = `parasite-mobile-${Date.now()}.jpg`;
    const uploadResult = await s3Service.uploadFile(imageBuffer, fileName, 'parasites');
    
    // Analiz kaydını oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'Parasite',
      imageUrl: uploadResult.url,
      rawImageKey: uploadResult.key,
      processedImageKey: uploadResult.thumbnailKey,
      location: data.location || null,
      notes: data.notes || null,
      parasiteResults: data.results,
      processingTimeMs: data.processingTimeMs,
      processedOnMobile: true,
      mobileModelInfo: {
        modelName: data.modelInfo.modelName || 'Unknown',
        modelVersion: data.modelInfo.modelVersion || 'Unknown',
        deviceInfo: data.modelInfo.deviceInfo || 'Unknown'
      }
    });
    
    await analysis.save();
    
    return {
      analysisId: analysis._id,
      imageUrl: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl
    };
  } catch (error) {
    console.error('Mobile parasite analysis save error:', error);
    throw new Error('Mobil parazit analiz sonuçları kaydedilirken bir hata oluştu');
  }
};

/**
 * Mobil cihazda işlenmiş MNIST analiz sonuçlarını kaydet
 * @param {Object} data - Analiz verileri ve sonuçları
 * @param {Buffer} imageBuffer - Görüntü buffer'ı
 * @param {String} userId - Kullanıcı ID
 * @returns {Object} - Analiz sonuçları
 */
exports.saveMobileMNISTAnalysis = async (data, imageBuffer, userId) => {
  try {
    // S3'e yükle
    const fileName = `mnist-mobile-${Date.now()}.jpg`;
    const uploadResult = await s3Service.uploadFile(imageBuffer, fileName, 'digits');
    
    // Analiz kaydını oluştur
    const analysis = new Analysis({
      userId,
      analysisType: 'MNIST',
      imageUrl: uploadResult.url,
      rawImageKey: uploadResult.key,
      processedImageKey: uploadResult.thumbnailKey,
      notes: data.notes || null,
      digitResults: data.results,
      processingTimeMs: data.processingTimeMs,
      processedOnMobile: true,
      mobileModelInfo: {
        modelName: data.modelInfo.modelName || 'Unknown',
        modelVersion: data.modelInfo.modelVersion || 'Unknown',
        deviceInfo: data.modelInfo.deviceInfo || 'Unknown'
      }
    });
    
    await analysis.save();
    
    return {
      analysisId: analysis._id,
      imageUrl: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl
    };
  } catch (error) {
    console.error('Mobile MNIST analysis save error:', error);
    throw new Error('Mobil MNIST analiz sonuçları kaydedilirken bir hata oluştu');
  }
};

/**
 * Analiz sonucunu ID'ye göre getir
 * @param {String} analysisId - Analiz ID
 * @param {String} userId - Kullanıcı ID
 * @returns {Object} - Analiz sonuçları
 */
exports.getAnalysisById = async (analysisId, userId) => {
  try {
    const analysis = await Analysis.findOne({ _id: analysisId, userId });
    
    if (!analysis) {
      throw new Error('Analiz bulunamadı');
    }
    
    return analysis;
  } catch (error) {
    console.error('Get analysis error:', error);
    throw error;
  }
};

/**
 * Kullanıcı analizlerini getir
 * @param {String} userId - Kullanıcı ID
 * @param {Object} options - Filtreleme ve sayfalama seçenekleri
 * @returns {Object} - Analiz listesi
 */
exports.getUserAnalyses = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, type, startDate, endDate, processedOnMobile } = options;
    
    // Filtre oluştur
    const filter = { userId };
    
    if (type) {
      filter.analysisType = type;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    if (processedOnMobile !== undefined) {
      filter.processedOnMobile = processedOnMobile;
    }
    
    // Toplam kayıt sayısını hesapla
    const total = await Analysis.countDocuments(filter);
    
    // Analizleri getir
    const analyses = await Analysis.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Analiz sonuçlarını formatlayarak döndür
    const formattedAnalyses = analyses.map(analysis => {
      const result = {
        analysisId: analysis._id,
        analysisType: analysis.analysisType,
        imageUrl: analysis.imageUrl,
        timestamp: analysis.createdAt,
        isUploaded: analysis.isUploaded,
        processedOnMobile: analysis.processedOnMobile
      };
      
      // Mobil model bilgilerini ekle (varsa)
      if (analysis.processedOnMobile && analysis.mobileModelInfo) {
        result.mobileModelInfo = analysis.mobileModelInfo;
      }
      
      // Tipine göre sonuçları ekle
      if (analysis.analysisType === 'Parasite' && analysis.parasiteResults?.length > 0) {
        result.dominantResult = analysis.parasiteResults[0];
      } else if (analysis.analysisType === 'MNIST' && analysis.digitResults?.length > 0) {
        result.dominantResult = analysis.digitResults[0];
      }
      
      return result;
    });
    
    return {
      total,
      page,
      limit,
      hasMore: total > page * limit,
      analyses: formattedAnalyses
    };
  } catch (error) {
    console.error('Get user analyses error:', error);
    throw new Error('Analizler getirilirken bir hata oluştu');
  }
}; 