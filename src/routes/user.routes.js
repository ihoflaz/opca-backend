const express = require('express');
const router = express.Router();

// Middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Controller
const userController = require('../controllers/user.controller');

// Tüm route'lar admin yetkisi gerektirir
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/users
 * @desc    Tüm kullanıcıları listele (filtreleme ve sayfalama ile)
 * @access  Admin
 */
router.get('/', userController.getAllUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Kullanıcı istatistikleri (Dashboard için)
 * @access  Admin
 */
router.get('/stats', userController.getUserStats);

/**
 * @route   GET /api/users/:id
 * @desc    Kullanıcı detayı getir
 * @access  Admin
 */
router.get('/:id', userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Yeni kullanıcı oluştur
 * @access  Admin
 */
router.post('/', userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Kullanıcı güncelle
 * @access  Admin
 */
router.put('/:id', userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Kullanıcı sil
 * @access  Admin
 */
router.delete('/:id', userController.deleteUser);

module.exports = router; 