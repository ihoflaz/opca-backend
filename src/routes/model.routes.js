const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const modelController = require('../controllers/model.controller');

/**
 * @route GET /api/models
 * @desc Tüm model versiyon bilgilerini listeler
 * @access Private
 */
router.get('/', authenticate, modelController.getAvailableModels);

/**
 * @route GET /api/models/:category/:name/:version/metadata
 * @desc Belirli bir modelin metadata bilgilerini döndürür
 * @access Private
 */
router.get('/:category/:name/:version/metadata', authenticate, modelController.getModelMetadata);

/**
 * @route GET /api/models/:category/:name/:version/check-update
 * @desc Belirli bir model için güncelleme gerekip gerekmediğini kontrol eder
 * @access Private
 */
router.get('/:category/:name/:version/check-update', authenticate, modelController.checkModelUpdate);

module.exports = router; 