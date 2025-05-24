const mongoose = require('mongoose');

const digitSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 9,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
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

module.exports = mongoose.model('Digit', digitSchema); 