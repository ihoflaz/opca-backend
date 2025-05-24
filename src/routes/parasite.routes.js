const express = require('express');
const router = express.Router();
const parasiteController = require('../controllers/parasite.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   GET /api/parasites
 * @desc    Tüm parazit bilgilerini getirir
 * @access  Public
 */
router.get('/', parasiteController.getAllParasites);

/**
 * @route   GET /api/parasites/:type
 * @desc    Parazit bilgisini tipine göre getirir
 * @access  Public
 */
router.get('/:type', parasiteController.getParasiteByType);

/**
 * @route   POST /api/parasites
 * @desc    Yeni parazit bilgisi ekler
 * @access  Private (Admin)
 */
router.post(
  '/',
  authMiddleware.authenticate,
  parasiteController.createParasite
);

/**
 * @route   PUT /api/parasites/:type
 * @desc    Parazit bilgisini günceller
 * @access  Private (Admin)
 */
router.put(
  '/:type',
  authMiddleware.authenticate,
  parasiteController.updateParasite
);

module.exports = router; 