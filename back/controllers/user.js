// ------------------------------
// Import des modules nécessaires
// ------------------------------
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// -------------------------------------

// MECANIQUE D'INSCRIPTION D'UN USER
exports.signupUser = (req, res) => {
	bcrypt
		// Hachage du mot de passe
		.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
		.then((hash) => {
			// Création d'un nouvel utilisateur dans la DB
			const newUser = new User({
				email: req.body.email,
				password: hash,
			});

			// Enregistrement du nouvel utilisateur dans la DB
			newUser
				.save()
				.then(() => res.status(201).json({ message: `User successfully created.` }))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(500).json(err));
};

// -------------------------------------
