const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);

app.post('/api/users/register', async (req, res) => {
  try {
    const { userId, privateKey } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'Private key is required' 
      });
    }
    
    const existingKey = await User.findOne({ privateKey });
    if (existingKey) {
      return res.status(409).json({ 
        success: false, 
        message: 'This private key is already registered' 
      });
    }
    
    let user = await User.findOne({ userId });
    
    if (user) {
      user.privateKey = privateKey;
      await user.save();
    } else {
      const serverUserId = userId.startsWith('user_') ? 
        'hxo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5) : 
        userId;
        
      user = new User({
        userId: serverUserId,
        privateKey
      });
      await user.save();
    }
    
    res.status(200).json({ 
      success: true, 
      userId: user.userId,
      message: 'Private key registered successfully' 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

app.post('/api/users/verify', async (req, res) => {
  const { privateKey } = req.body;
  
  const user = await User.findOne({ privateKey });
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  return res.status(200).json({ 
    success: true, 
    userId: user.userId,
    message: 'User verified successfully' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});