// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

const sauceController = require('../controllers/sauce');

// -------------
// Routes 'SAUCE'
// -------------
router.get('/', auth, sauceController.getAllSauces);

router.get('/:id', auth, sauceController.getSauceById);

router.post('/', auth, multer, sauceController.createSauce);

router.put('/:id', auth, multer, sauceController.updateSauce);

router.delete('/:id', auth);

router.post('/:id/like', auth);

// ------------------------
// Export des routes 'SAUCE'
// ------------------------
module.exports = router;
