const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const uploadMiddleware = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const rateLimitMiddleware = require('../middleware/rate-limit.middleware');
const cacheMiddleware = require('../middleware/cache.middleware');

// Kimlik doğrulama kontrolü
router.use(authMiddleware.authenticate);

/**
 * @route   POST /api/analysis/mobile/parasite
 * @desc    Cihazda işlenmiş parazit analiz sonuçlarını kaydeder
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/mobile/parasite',
  rateLimitMiddleware.uploadLimiter,
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.mobileParasiteAnalysis,
  validationMiddleware.validateRequest,
  analysisController.saveParasiteAnalysisFromMobile
);

/**
 * @route   POST /api/analysis/mobile/mnist
 * @desc    Cihazda işlenmiş MNIST analiz sonuçlarını kaydeder
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/mobile/mnist',
  rateLimitMiddleware.uploadLimiter,
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.mobileMnistAnalysis,
  validationMiddleware.validateRequest,
  analysisController.saveMNISTAnalysisFromMobile
);

/**
 * @route   POST /api/analysis/batch-upload
 * @desc    Çoklu analiz sonuçlarını toplu olarak yükler (offline mod senkronizasyonu için)
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/batch-upload',
  rateLimitMiddleware.uploadLimiter,
  analysisController.saveBatchAnalysisResults
);

/**
 * @route   GET /api/analysis/results/:id
 * @desc    Analiz sonuçlarını getirir
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.get(
  '/results/:id',
  rateLimitMiddleware.apiLimiter,
  validationMiddleware.analysisValidationRules.analysisId,
  validationMiddleware.validateRequest,
  cacheMiddleware.cacheAnalysisResult(5 * 60 * 1000), // 5 dakika önbellek
  analysisController.getAnalysisResult
);

/**
 * @route   GET /api/analysis/history
 * @desc    Kullanıcının analiz geçmişini getirir
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.get(
  '/history',
  rateLimitMiddleware.apiLimiter,
  validationMiddleware.analysisValidationRules.history,
  validationMiddleware.validateRequest,
  cacheMiddleware.cacheResponse(2 * 60 * 1000), // 2 dakika önbellek
  analysisController.getAnalysisHistory
);

/**
 * @route   GET /api/analysis/admin/all
 * @desc    Tüm analizleri getirir (Admin Dashboard için)
 * @access  Admin
 */
router.get(
  '/admin/all',
  authMiddleware.authorize('admin'),
  rateLimitMiddleware.apiLimiter,
  validationMiddleware.analysisValidationRules.adminHistory,
  validationMiddleware.validateRequest,
  cacheMiddleware.cacheResponse(2 * 60 * 1000), // 2 dakika önbellek
  analysisController.getAllAnalyses
);

/**
 * @route   GET /api/analysis/admin/stats
 * @desc    Analiz istatistikleri (Admin Dashboard için)
 * @access  Admin
 */
router.get(
  '/admin/stats',
  authMiddleware.authorize('admin'),
  rateLimitMiddleware.apiLimiter,
  cacheMiddleware.cacheResponse(5 * 60 * 1000), // 5 dakika önbellek
  analysisController.getAnalysisStats
);

module.exports = router; 