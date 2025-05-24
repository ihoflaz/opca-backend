const authService = require('../services/auth.service');

/**
 * Kullanıcı kaydı
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Kayıt işlemini gerçekleştir
    const result = await authService.register({ name, email, password });
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcı girişi
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Giriş işlemini gerçekleştir
    const result = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Token yenileme
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token gereklidir'
      });
    }
    
    // Token yenileme işlemini gerçekleştir
    const result = await authService.refreshToken(refreshToken);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mevcut kullanıcıyı getir
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 