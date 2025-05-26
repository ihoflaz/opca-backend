const mongoose = require('mongoose');

/**
 * MongoDB bağlantı ayarları ve optimizasyonları
 * @param {String} uri MongoDB bağlantı URI'si
 * @returns {Promise} Bağlantı sonucu
 */
const connectDatabase = async (uri) => {
  try {
    // Bağlantı seçenekleri
    const options = {
      // Yeni URL parser'ı kullan
      useNewUrlParser: true,
      
      // MongoDB sürücüsünün yeni sunucu izleme motorunu kullan
      // Not: MongoDB 4.0.0+ ve Mongoose 6.0+ ile artık otomatik olarak true
      // useUnifiedTopology: true, 
      
      // Bağlantı havuzu boyutunu ayarla (varsayılan: 5)
      maxPoolSize: 10,
      
      // Bağlantı zaman aşımı (ms)
      connectTimeoutMS: 10000,
      
      // Sorgu zaman aşımı (ms)
      socketTimeoutMS: 45000,
      
      // Sunucu seçme politikası (en yakın sunucuyu seç)
      serverSelectionTimeoutMS: 5000,
      
      // Okuma tercihi (varsayılan sunucudan oku)
      // readPreference: 'primary',
      
      // Yazma kaygısı (yazmanın tamamlandığından emin ol)
      // w: 'majority',
      
      // Bağlantı havuzu için boşta kalma süresi kontrolü (ms)
      // heartbeatFrequencyMS: 10000,
    };

    // MongoDB'ye bağlan
    await mongoose.connect(uri, options);
    
    // Debug modunda Mongoose sorgularını logla (kapatıldı)
    // if (process.env.NODE_ENV === 'development') {
    //   mongoose.set('debug', true);
    // }
    
    // Bağlantı olaylarını dinle
    mongoose.connection.on('connected', () => {
      console.log('MongoDB bağlantısı başarılı');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB bağlantı hatası:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB bağlantısı kesildi');
    });
    
    // Uygulama kapandığında bağlantıyı kapat
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB bağlantısı kapatıldı');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB bağlantısı kurulamadı:', error);
    throw error;
  }
};

module.exports = connectDatabase; 