const mongoose = require('mongoose');

const parasiteResultSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Neosporosis', 'Echinococcosis', 'Coenurosis'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, { _id: false });

const digitResultSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['Parasite', 'MNIST'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  // S3'teki ham görüntü
  rawImageKey: {
    type: String,
    required: true
  },
  // Görüntünün işlenmiş versiyonu (thumbnail)
  processedImageKey: {
    type: String
  },
  location: {
    type: String
  },
  notes: {
    type: String
  },
  parasiteResults: [parasiteResultSchema],
  digitResults: [digitResultSchema],
  processingTimeMs: {
    type: Number
  },
  isUploaded: {
    type: Boolean,
    default: true
  },
  // Mobil cihazda işlenip işlenmediği
  processedOnMobile: {
    type: Boolean,
    default: false
  },
  // Mobil cihaz model bilgileri
  mobileModelInfo: {
    modelName: String,
    modelVersion: String,
    deviceInfo: String
  },
  uploadTimestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// İndeksleme
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ analysisType: 1 });
analysisSchema.index({ processedOnMobile: 1 });

module.exports = mongoose.model('Analysis', analysisSchema); 