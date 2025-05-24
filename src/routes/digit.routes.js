const express = require('express');
const router = express.Router();
const digitController = require('../controllers/digit.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   GET /api/digits
 * @desc    Tüm rakam bilgilerini getirir
 * @access  Public
 */
router.get('/', digitController.getAllDigits);

/**
 * @route   GET /api/digits/:value
 * @desc    Rakam bilgisini değerine göre getirir
 * @access  Public
 */
router.get('/:value', digitController.getDigitByValue);

/**
 * @route   POST /api/digits
 * @desc    Yeni rakam bilgisi ekler
 * @access  Private (Admin)
 */
router.post(
  '/',
  authMiddleware.authenticate,
  digitController.createDigit
);

/**
 * @route   PUT /api/digits/:value
 * @desc    Rakam bilgisini günceller
 * @access  Private (Admin)
 */
router.put(
  '/:value',
  authMiddleware.authenticate,
  digitController.updateDigit
);

module.exports = router; 