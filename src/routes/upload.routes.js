const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   POST /api/upload/image
 * @desc    Tek görüntü dosyası yükleme
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/image',
  authMiddleware.authenticate,
  uploadMiddleware.uploadSingle,
  uploadMiddleware.handleUploadError,
  uploadController.uploadImage
);

/**
 * @route   POST /api/upload/multiple
 * @desc    Çoklu görüntü dosyası yükleme (maksimum 5)
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.post(
  '/multiple',
  authMiddleware.authenticate,
  uploadMiddleware.uploadMultiple,
  uploadMiddleware.handleUploadError,
  uploadController.uploadMultipleImages
);

/**
 * @route   DELETE /api/upload/:key
 * @desc    S3'ten dosya silme
 * @access  Private (Kimlik doğrulama gerekli)
 */
router.delete(
  '/:key',
  authMiddleware.authenticate,
  uploadController.deleteImage
);

module.exports = router; 