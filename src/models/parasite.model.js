const mongoose = require('mongoose');

const parasiteSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Neosporosis', 'Echinococcosis', 'Coenurosis', 'Toxoplasmosis', 'Cryptosporidiosis'],
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  preventionMeasures: [{
    type: String
  }],
  imageUrls: [{
    type: String
  }],
  // Örnek resimler ve ek bilgiler
  examples: [{
    imageUrl: String,
    description: String
  }],
  metadata: {
    type: Map,
    of: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Parasite', parasiteSchema); 