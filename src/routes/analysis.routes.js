const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const uploadMiddleware = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');

// Kimlik doğrulama kontrolü
router.use(authMiddleware.authenticate);

/**
 * @route   POST /api/analysis/parasite
 * @desc    Parazit analizi yapar
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/parasite',
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.parasiteAnalysis,
  validationMiddleware.validateRequest,
  analysisController.analyzeParasite
);

/**
 * @route   POST /api/analysis/mnist
 * @desc    MNIST rakam analizi yapar
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/mnist',
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.mnistAnalysis,
  validationMiddleware.validateRequest,
  analysisController.analyzeMNIST
);

/**
 * @route   POST /api/analysis/mobile/parasite
 * @desc    Mobil cihazda işlenmiş parazit analiz sonuçlarını kaydeder
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/mobile/parasite',
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.mobileParasiteAnalysis,
  validationMiddleware.validateRequest,
  analysisController.saveParasiteAnalysisFromMobile
);

/**
 * @route   POST /api/analysis/mobile/mnist
 * @desc    Mobil cihazda işlenmiş MNIST analiz sonuçlarını kaydeder
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/mobile/mnist',
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  validationMiddleware.analysisValidationRules.mobileMnistAnalysis,
  validationMiddleware.validateRequest,
  analysisController.saveMNISTAnalysisFromMobile
);

/**
 * @route   GET /api/analysis/results/:id
 * @desc    Analiz sonuçlarını getirir
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.get(
  '/results/:id',
  validationMiddleware.analysisValidationRules.analysisId,
  validationMiddleware.validateRequest,
  analysisController.getAnalysisResult
);

/**
 * @route   GET /api/analysis/history
 * @desc    Kullanıcının analiz geçmişini getirir
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.get(
  '/history',
  validationMiddleware.analysisValidationRules.history,
  validationMiddleware.validateRequest,
  analysisController.getAnalysisHistory
);

module.exports = router; 