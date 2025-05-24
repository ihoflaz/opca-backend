const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Kullanıcı kaydı
 * @route POST /api/auth/register
 * @access Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Ad alanı gereklidir'),
    body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Şifre en az 6 karakter olmalıdır')
  ],
  authController.register
);

/**
 * Kullanıcı girişi
 * @route POST /api/auth/login
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
    body('password').notEmpty().withMessage('Şifre gereklidir')
  ],
  authController.login
);

/**
 * Token yenileme
 * @route POST /api/auth/refresh-token
 * @access Public
 */
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token gereklidir')
  ],
  authController.refreshToken
);

/**
 * Mevcut kullanıcıyı getir
 * @route GET /api/auth/me
 * @access Private
 */
router.get('/me', protect, authController.getMe);

module.exports = router; 