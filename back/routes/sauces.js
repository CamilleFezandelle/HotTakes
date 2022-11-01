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

router.delete('/:id', auth, sauceController.deleteSauce);

router.post('/:id/like', auth, sauceController.likeOrDislikeSauce);

// ------------------------
// Export des routes 'SAUCE'
// ------------------------
module.exports = router;
