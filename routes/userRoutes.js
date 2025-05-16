const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, getPing, claim, importPrv } = require('../controllers/userController');

// Register user route
router.post('/register', registerUser);

// Verify user route
router.post('/verify', verifyUser);

//sync with extension while import private key
router.post('/import', importPrv);

//get ping from the user
router.post('/ping', getPing);

//Handle claim request
router.post('/claim', claim);

module.exports = router;