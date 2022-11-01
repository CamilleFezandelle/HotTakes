// ------------------------------
// Import des modules nécessaires
// ------------------------------
const fs = require('fs');

const Sauce = require('../models/sauce');

// -------------------------------------

// AFFICHAGE DE TOUTES LES SAUCES
exports.getAllSauces = (req, res) => {
	Sauce.find()
		.then((allSauces) => res.status(200).json(allSauces))
		.catch((err) => res.status(500).json(err));
};

// -------------------------------------
