// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require('express');
const router = express.Router();

// -------------
// Routes 'USER'
// -------------
router.post('/signup');

router.post('/login');

// ------------------------
// Export des routes 'USER'
// ------------------------
module.exports = router;
