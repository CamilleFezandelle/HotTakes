// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const emailVerificator = require('../middleware/emailVerificator');
const passwordVerificator = require('../middleware/passwordVerificator');

// -------------
// Routes 'USER'
// -------------
router.post('/signup', emailVerificator, passwordVerificator, userController.signupUser);

router.post('/login');

// ------------------------
// Export des routes 'USER'
// ------------------------
module.exports = router;
