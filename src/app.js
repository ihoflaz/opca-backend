const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Konfigürasyon modüllerini yükle
const config = require('./config');

// Middleware
const errorHandler = require('./middleware/error.middleware');

// Rotalar
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const analysisRoutes = require('./routes/analysis.routes');
const parasiteRoutes = require('./routes/parasite.routes');
const digitRoutes = require('./routes/digit.routes');

// Uygulama oluştur
const app = express();

// Middleware
app.use(cors(config.app.cors));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
config.connectDatabase(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/parasites', parasiteRoutes);
app.use('/api/digits', digitRoutes);

// Ana rota
app.get('/', (req, res) => {
  res.json({ 
    message: 'OpCa API çalışıyor',
    version: config.app.apiVersion,
    environment: config.app.env 
  });
});

// Hata yakalama middleware'i
app.use(errorHandler);

// Port dinleme
const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

module.exports = app; 