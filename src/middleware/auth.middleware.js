const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Kullanıcı kimlik doğrulama middleware'i
 * İstek header'ında geçerli bir JWT token'ı olup olmadığını kontrol eder
 */
exports.authenticate = exports.protect = async (req, res, next) => {
  try {
    let token;

    // Token'ı header'dan al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Token yoksa hata döndür
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bu kaynağa erişmek için giriş yapmalısınız'
      });
    }

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı bul ve isteğe ekle
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Bu token geçerli bir kullanıcıya ait değil'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Belirli rollere sahip kullanıcılar için erişim kontrolü
 * @param  {...String} roles İzin verilen roller
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Önce kimlik doğrulaması gerekiyor'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlemi yapmak için yetkiniz yok'
      });
    }

    next();
  };
}; 