const cache = require('memory-cache');

/**
 * Belirli bir süre için önbelleğe alma middleware'i
 * @param {number} duration - Önbellek süresi (milisaniye)
 * @returns {Function} Middleware fonksiyonu
 */
exports.cacheResponse = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    } else {
      // Orijinal res.json metodunu sakla
      const originalJson = res.json;
      
      // res.json metodunu değiştir
      res.json = function(body) {
        // Yanıtı önbelleğe al
        cache.put(key, body, duration);
        
        // Orijinal json metodu ile yanıtı gönder
        return originalJson.call(this, body);
      };

      next();
    }
  };
};

/**
 * Belirli bir ID için analiz sonuçlarını önbelleğe alma
 * @param {number} duration - Önbellek süresi (milisaniye)
 * @returns {Function} Middleware fonksiyonu
 */
exports.cacheAnalysisResult = (duration) => {
  return (req, res, next) => {
    const key = `analysis_${req.params.id}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    } else {
      // Orijinal res.json metodunu sakla
      const originalJson = res.json;
      
      // res.json metodunu değiştir
      res.json = function(body) {
        // Yanıtı önbelleğe al
        cache.put(key, body, duration);
        
        // Orijinal json metodu ile yanıtı gönder
        return originalJson.call(this, body);
      };

      next();
    }
  };
};

/**
 * Önbellekten belirli bir anahtarı temizleme yardımcısı
 * @param {string} key - Silinecek önbellek anahtarı
 */
exports.clearCache = (key) => {
  cache.del(key);
};

/**
 * Kullanıcıya ait tüm analiz önbelleklerini temizleme
 * @param {string} userId - Kullanıcı ID
 */
exports.clearUserAnalysisCache = (userId) => {
  // Cache keys "analysis_" prefixine sahip olanları bul
  const keys = Object.keys(cache.cache).filter(key => 
    key.startsWith('analysis_')
  );
  
  // Tüm anahtarları temizle
  keys.forEach(key => cache.del(key));
}; 