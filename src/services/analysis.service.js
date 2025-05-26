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
    const { results, processingTimeMs, modelName, modelVersion } = await aiService.analyzeParasite(imageBuffer);
    
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
      processingTimeMs,
      modelName,
      modelVersion,
      deviceInfo: 'Server'
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
    const { results, processingTimeMs, modelName, modelVersion } = await aiService.analyzeMNIST(imageBuffer);
    
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
      processingTimeMs,
      modelName,
      modelVersion,
      deviceInfo: 'Server'
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
      modelName: data.modelName || 'Unknown',
      modelVersion: data.modelVersion || 'Unknown',
      deviceInfo: data.deviceInfo || 'Unknown'
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
      modelName: data.modelName || 'Unknown',
      modelVersion: data.modelVersion || 'Unknown',
      deviceInfo: data.deviceInfo || 'Unknown'
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

/**
 * Tüm analizleri getir (Admin Dashboard için)
 * @param {Object} options - Filtreleme ve sayfalama seçenekleri
 * @returns {Object} - Analiz listesi
 */
exports.getAllAnalyses = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      startDate, 
      endDate, 
      processedOnMobile, 
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;
    
    // Sayfa ve limit validasyonu
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    // Filtre oluştur
    const filter = {};
    
    if (type && ['Parasite', 'MNIST'].includes(type)) {
      filter.analysisType = type;
    }
    
    if (userId) {
      filter.userId = userId;
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
    
    // Sıralama
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Toplam kayıt sayısını hesapla
    const totalCount = await Analysis.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);
    
    // Analizleri getir (kullanıcı bilgileri ile birlikte)
    const analyses = await Analysis.find(filter)
      .populate('userId', 'name email role')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
    // Analiz sonuçlarını formatlayarak döndür
    const formattedAnalyses = analyses.map(analysis => ({
      _id: analysis._id,
      analysisType: analysis.analysisType,
      imageUrl: analysis.imageUrl,
      thumbnailUrl: analysis.processedImageKey ? 
        `https://opca-bucket.s3.amazonaws.com/${analysis.processedImageKey}` : 
        analysis.imageUrl,
      location: analysis.location,
      notes: analysis.notes,
      parasiteResults: analysis.parasiteResults || [],
      digitResults: analysis.digitResults || [],
      processingTimeMs: analysis.processingTimeMs,
      processedOnMobile: analysis.processedOnMobile,
      modelName: analysis.modelName,
      modelVersion: analysis.modelVersion,
      deviceInfo: analysis.deviceInfo,
      user: analysis.userId ? {
        _id: analysis.userId._id,
        name: analysis.userId.name,
        email: analysis.userId.email,
        role: analysis.userId.role
      } : null,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt
    }));
    
    return {
      analyses: formattedAnalyses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      },
      filters: {
        type: type || null,
        userId: userId || null,
        processedOnMobile: processedOnMobile !== undefined ? processedOnMobile : null,
        startDate: startDate || null,
        endDate: endDate || null,
        sortBy,
        sortOrder
      }
    };
  } catch (error) {
    console.error('Get all analyses error:', error);
    throw new Error('Analizler getirilirken bir hata oluştu');
  }
};

/**
 * Analiz istatistikleri (Admin Dashboard için)
 * @returns {Object} - İstatistik verileri
 */
exports.getAnalysisStats = async () => {
  try {
    // Toplam analiz sayısı
    const totalAnalyses = await Analysis.countDocuments();

    // Analiz tipine göre dağılım
    const typeStats = await Analysis.aggregate([
      {
        $group: {
          _id: '$analysisType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Mobil vs Server işleme dağılımı
    const processingStats = await Analysis.aggregate([
      {
        $group: {
          _id: '$processedOnMobile',
          count: { $sum: 1 }
        }
      }
    ]);

    // Son 30 günde yapılan analizler
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAnalyses = await Analysis.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Günlük analiz istatistikleri (son 30 gün)
    const dailyStats = await Analysis.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          parasiteCount: {
            $sum: { $cond: [{ $eq: ['$analysisType', 'Parasite'] }, 1, 0] }
          },
          mnistCount: {
            $sum: { $cond: [{ $eq: ['$analysisType', 'MNIST'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // En aktif kullanıcılar (son 30 gün)
    const topUsers = await Analysis.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$userId',
          analysisCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          analysisCount: 1,
          userName: '$user.name',
          userEmail: '$user.email',
          userRole: '$user.role'
        }
      },
      {
        $sort: { analysisCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Ortalama işleme süreleri
    const avgProcessingTime = await Analysis.aggregate([
      {
        $match: {
          processingTimeMs: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$analysisType',
          avgTime: { $avg: '$processingTimeMs' },
          minTime: { $min: '$processingTimeMs' },
          maxTime: { $max: '$processingTimeMs' }
        }
      }
    ]);

    return {
      totalAnalyses,
      recentAnalyses,
      typeDistribution: typeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      processingDistribution: processingStats.reduce((acc, item) => {
        acc[item._id ? 'mobile' : 'server'] = item.count;
        return acc;
      }, {}),
      dailyAnalyses: dailyStats,
      topUsers,
      avgProcessingTimes: avgProcessingTime.reduce((acc, item) => {
        acc[item._id] = {
          average: Math.round(item.avgTime),
          minimum: item.minTime,
          maximum: item.maxTime
        };
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Get analysis stats error:', error);
    throw new Error('Analiz istatistikleri getirilirken bir hata oluştu');
  }
}; 