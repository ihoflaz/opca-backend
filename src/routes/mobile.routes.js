const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');
const mobileAnalysisController = require('../controllers/mobile.analysis.controller');

/**
 * @route POST /api/analysis/mobile/parasite
 * @desc Mobil cihazda yapılan parazit analizini kaydeder
 * @access Private
 */
router.post(
  '/parasite',
  authenticate,
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  mobileAnalysisController.saveMobileParasiteAnalysis
);

/**
 * @route POST /api/analysis/mobile/mnist
 * @desc Mobil cihazda yapılan MNIST analizini kaydeder
 * @access Private
 */
router.post(
  '/mnist',
  authenticate,
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  mobileAnalysisController.saveMobileMNISTAnalysis
);

module.exports = router; 