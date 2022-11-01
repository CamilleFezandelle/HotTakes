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

// RECUPERATION D'UNE SAUCE (ID)
exports.getSauceById = (req, res) => {
	const sauceId = req.params.id;
	Sauce.findById(sauceId)
		.then((sauce) => res.json(sauce))
		.catch((err) => res.status(500).json(err));
};

// CREATION D'UNE SAUCE
exports.createSauce = (req, res) => {
	// Tranformation de la réponse (JSON) en objet JavaScript
	const sauceObject = JSON.parse(req.body.sauce);

	// Test d'authenticité de l'utilisateur
	if (req.auth.userId !== sauceObject.userId) {
		return res.status(403).json({ message: 'Forbidden access.' });
	}

	// Initialisation des informations de la sauce dans une variable
	const newSauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersdisLiked: [],
	});

	// Ajout de la sauce dans la DB
	newSauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce successfully created.' }))
		.catch((err) => res.status(400).json(err));
};

// -------------------------------------
