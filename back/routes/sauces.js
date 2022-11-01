// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

// -------------
// Routes 'SAUCE'
// -------------
router.get('/', auth);

router.get('/:id', auth);

router.post('/', auth);

router.put('/:id', auth);

router.delete('/:id', auth);

router.post('/:id/like', auth);

// ------------------------
// Export des routes 'SAUCE'
// ------------------------
module.exports = router;
