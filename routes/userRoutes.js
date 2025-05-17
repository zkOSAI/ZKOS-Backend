const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, getPing, claim, importPrv, userInfo } = require('../controllers/userController');

// Register user route
router.post('/register', registerUser);

// Verify user route
router.post('/verify', verifyUser);


//get ping from the user
router.post('/ping', getPing);

//sync with extension while import private key
router.post('/import', importPrv);

//Handle claim request
router.post('/claim', claim);

//user information
router.post('/info', userInfo);

module.exports = router;