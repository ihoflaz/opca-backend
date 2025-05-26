const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * JWT token oluşturur
 * @param {Object} user Kullanıcı objesi
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'supersecret_opca_development_key',
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h' }
  );
};

/**
 * Refresh token oluşturur
 * @param {Object} user Kullanıcı objesi
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_opca_development_key',
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

/**
 * Kullanıcı kaydı yapar
 * @param {Object} userData Kullanıcı verileri
 * @returns {Object} Kullanıcı ve token bilgileri
 */
exports.register = async (userData) => {
  // Kullanıcı oluştur
  const user = await User.create(userData);
  
  // Token oluştur
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token,
    refreshToken
  };
};

/**
 * Kullanıcı girişi yapar
 * @param {String} email E-posta adresi
 * @param {String} password Şifre
 * @returns {Object} Kullanıcı ve token bilgileri
 */
exports.login = async (email, password) => {
  // Kullanıcıyı e-posta adresine göre bul (şifre alanını da getir)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  
  // Şifre doğrulaması
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Geçersiz e-posta veya şifre');
  }
  
  // Token oluştur
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token,
    refreshToken
  };
};

/**
 * Refresh token'dan yeni token oluşturur
 * @param {String} refreshToken Refresh token
 * @returns {Object} Yeni token bilgileri
 */
exports.refreshToken = async (refreshToken) => {
  try {
    // Refresh token'ı doğrula
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_opca_development_key');
    
    // Kullanıcıyı bul
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error('Geçersiz token');
    }
    
    // Yeni token oluştur
    const newToken = generateToken(user);
    
    return {
      token: newToken
    };
  } catch (error) {
    throw new Error('Geçersiz veya süresi dolmuş token');
  }
}; 