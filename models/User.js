const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  privateKey: { 
    type: String, 
    required: true, 
    unique: true 
  },
  walletPubKey: {
    type: String,
    required: false,
  },
  pingCount: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  lastPingTime: {
    type: Date,
    default: Date.now
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);