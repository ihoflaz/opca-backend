const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const rateLimitMiddleware = require('../middleware/rate-limit.middleware');

const router = express.Router();

/**
 * Kullanıcı kaydı
 * @route POST /api/auth/register
 * @access Public
 */
router.post(
  '/register',
  rateLimitMiddleware.authLimiter,
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
  rateLimitMiddleware.authLimiter,
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
  rateLimitMiddleware.authLimiter,
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
router.get('/me', protect, rateLimitMiddleware.apiLimiter, authController.getMe);

module.exports = router; 