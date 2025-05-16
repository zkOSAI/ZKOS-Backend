const User = require('../models/User');

// Register or update user
const registerUser = async (req, res, next) => {
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
    next(error);
  }
};

// Verify user by private key
const verifyUser = async (req, res, next) => {
  try {
    const { privateKey } = req.body;

    const user = await User.findOne({ privateKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      userId: user.userId,
      message: 'User verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getPing = async (req, res, next) => {
  try {
    const { privateKey } = req.body;
    console.log(privateKey);
    
    const user = await User.findOne({ privateKey });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current time
    const currentTime = new Date();
    console.log(currentTime);

    // Check if lastPingTime exists and if enough time has passed (more than 30 seconds)
    if (!user.lastPingTime || (currentTime - user.lastPingTime) > 30000) {
      // Increment pingCount
      user.pingCount += 1;

      // Update lastPingTime to current time
      user.lastPingTime = currentTime;

      // Save the updated user
      await user.save();

      return res.status(200).json({
        success: true,
        userId: user.userId,
        pingCount: user.pingCount,
        message: 'Ping recorded successfully'
      });
    } else {
      // If not enough time has passed, return without incrementing
      const timeLeft = 30 - Math.floor((currentTime - user.lastPingTime) / 1000);

      return res.status(429).json({
        success: false,
        message: `Please wait ${timeLeft} seconds before pinging again`,
        pingCount: user.pingCount,
        lastPingTime: user.lastPingTime
      });
    }

  } catch (error) {
    next(error);
  }
};

const importPrv = async (req, res, next) => {
  try {
    console.log("get request");
    console.log(req.body);

    const { prv, pub } = req.body;
    console.log(prv);
    console.log(pub);

    const user = await User.findOne({ privateKey: prv });

    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

        // Get current time
    const currentTime = new Date();
    user.lastPingTime = currentTime;
    user.walletPubKey = pub;
    // Save the updated user
    await user.save();
    return res.status(200).json({
        success: true,
        message: 'Imported correctly'
      });
  } catch (error) {
    next(error);
  }
};

const claim = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  verifyUser,
  getPing,
  importPrv,
  claim,

};