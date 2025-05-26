const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation hatalarını yakalayan middleware
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Auth işlemleri için validation kuralları
 */
const authValidationRules = {
  // Kayıt işlemi için validation
  register: [
    body('fullName')
      .notEmpty().withMessage('Ad Soyad gereklidir')
      .isLength({ min: 3, max: 50 }).withMessage('Ad Soyad 3-50 karakter arasında olmalıdır'),
    
    body('email')
      .notEmpty().withMessage('E-posta gereklidir')
      .isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Şifre gereklidir')
      .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalıdır')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
    
    body('role')
      .optional()
      .isIn(['user', 'veterinarian', 'admin']).withMessage('Geçersiz kullanıcı rolü')
  ],
  
  // Giriş işlemi için validation
  login: [
    body('email')
      .notEmpty().withMessage('E-posta gereklidir')
      .isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Şifre gereklidir')
  ],
  
  // Token yenileme için validation
  refreshToken: [
    body('refreshToken')
      .notEmpty().withMessage('Refresh token gereklidir')
  ]
};

/**
 * Analiz işlemleri için validation kuralları
 */
const analysisValidationRules = {
  // Parazit analizi için validation
  parasiteAnalysis: [
    body('location')
      .optional()
      .isString().withMessage('Konum bilgisi metin olmalıdır'),
    
    body('notes')
      .optional()
      .isString().withMessage('Notlar metin olmalıdır')
  ],
  
  // MNIST analizi için validation
  mnistAnalysis: [
    body('notes')
      .optional()
      .isString().withMessage('Notlar metin olmalıdır')
  ],
  
  // Mobil cihazdan gelen parazit analizi için validation
  mobileParasiteAnalysis: [
    body('results')
      .notEmpty().withMessage('Analiz sonuçları gereklidir')
      .custom((value) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error('Analiz sonuçları bir dizi olmalıdır');
          }
          if (parsed.length === 0) {
            throw new Error('En az bir analiz sonucu olmalıdır');
          }
          
          // Sonuç formatını kontrol et
          for (const result of parsed) {
            if (!result.type || !result.confidence) {
              throw new Error('Her sonuç bir tip ve güven değeri içermelidir');
            }
            if (!['Neosporosis', 'Echinococcosis', 'Coenurosis'].includes(result.type)) {
              throw new Error('Geçersiz parazit tipi');
            }
            if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
              throw new Error('Güven değeri 0-1 arasında olmalıdır');
            }
          }
          return true;
        } catch (error) {
          throw new Error(`Geçersiz analiz sonuçları: ${error.message}`);
        }
      }),
    
    body('processingTimeMs')
      .optional()
      .isInt({ min: 0 }).withMessage('İşlem süresi pozitif bir tamsayı olmalıdır')
      .toInt(),
    
    body('location')
      .optional()
      .isString().withMessage('Konum bilgisi metin olmalıdır'),
    
    body('notes')
      .optional()
      .isString().withMessage('Notlar metin olmalıdır'),
    
    body('modelName')
      .optional()
      .isString().withMessage('Model adı metin olmalıdır'),
    
    body('modelVersion')
      .optional()
      .isString().withMessage('Model versiyonu metin olmalıdır'),
    
    body('deviceInfo')
      .optional()
      .isString().withMessage('Cihaz bilgisi metin olmalıdır')
  ],
  
  // Mobil cihazdan gelen MNIST analizi için validation
  mobileMnistAnalysis: [
    body('results')
      .notEmpty().withMessage('Analiz sonuçları gereklidir')
      .custom((value) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error('Analiz sonuçları bir dizi olmalıdır');
          }
          if (parsed.length === 0) {
            throw new Error('En az bir analiz sonucu olmalıdır');
          }
          
          // Sonuç formatını kontrol et
          for (const result of parsed) {
            if (result.value === undefined || result.confidence === undefined) {
              throw new Error('Her sonuç bir değer ve güven değeri içermelidir');
            }
            if (!Number.isInteger(result.value) || result.value < 0 || result.value > 9) {
              throw new Error('Rakam değeri 0-9 arasında olmalıdır');
            }
            if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
              throw new Error('Güven değeri 0-1 arasında olmalıdır');
            }
          }
          return true;
        } catch (error) {
          throw new Error(`Geçersiz analiz sonuçları: ${error.message}`);
        }
      }),
    
    body('processingTimeMs')
      .optional()
      .isInt({ min: 0 }).withMessage('İşlem süresi pozitif bir tamsayı olmalıdır')
      .toInt(),
    
    body('notes')
      .optional()
      .isString().withMessage('Notlar metin olmalıdır'),
    
    body('modelName')
      .optional()
      .isString().withMessage('Model adı metin olmalıdır'),
    
    body('modelVersion')
      .optional()
      .isString().withMessage('Model versiyonu metin olmalıdır'),
    
    body('deviceInfo')
      .optional()
      .isString().withMessage('Cihaz bilgisi metin olmalıdır')
  ],
  
  // Analiz ID parametresi için validation
  analysisId: [
    param('id')
      .notEmpty().withMessage('Analiz ID gereklidir')
      .isMongoId().withMessage('Geçerli bir ID formatı gereklidir')
  ],
  
  // Analiz geçmişi için validation
  history: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Sayfa numarası pozitif bir tamsayı olmalıdır')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 }).withMessage('Limit 1-1000 arasında olmalıdır')
      .toInt(),
    
    query('type')
      .optional()
      .isIn(['Parasite', 'MNIST']).withMessage('Geçersiz analiz tipi'),
    
    query('processedOnMobile')
      .optional()
      .isBoolean().withMessage('processedOnMobile değeri boolean olmalıdır')
      .toBoolean(),
    
    query('startDate')
      .optional()
      .isISO8601().withMessage('Geçerli bir tarih formatı gereklidir'),
    
    query('endDate')
      .optional()
      .isISO8601().withMessage('Geçerli bir tarih formatı gereklidir')
  ],

  // Admin analiz geçmişi için validation
  adminHistory: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Sayfa numarası pozitif bir tamsayı olmalıdır')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit 1-100 arasında olmalıdır')
      .toInt(),
    
    query('type')
      .optional()
      .isIn(['Parasite', 'MNIST']).withMessage('Geçersiz analiz tipi'),
    
    query('userId')
      .optional()
      .isMongoId().withMessage('Geçerli bir kullanıcı ID formatı gereklidir'),
    
    query('processedOnMobile')
      .optional()
      .isBoolean().withMessage('processedOnMobile değeri boolean olmalıdır')
      .toBoolean(),
    
    query('startDate')
      .optional()
      .isISO8601().withMessage('Geçerli bir tarih formatı gereklidir'),
    
    query('endDate')
      .optional()
      .isISO8601().withMessage('Geçerli bir tarih formatı gereklidir'),

    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'analysisType', 'processingTimeMs']).withMessage('Geçersiz sıralama alanı'),

    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc']).withMessage('Sıralama yönü asc veya desc olmalıdır')
  ]
};

module.exports = {
  validateRequest,
  authValidationRules,
  analysisValidationRules
}; 