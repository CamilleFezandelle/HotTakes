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

// MECANIQUE DE CONNEXION D'UN USER
exports.login = (req, res) => {
	// Vérification que les champs 'email' et 'password' ne soient pas vides
	if (!req.body.email || !req.body.password) {
		return res.status(400).json({ message: 'Bad email or password.' });
	}

	User.findOne({ email: req.body.email })
		.then((user) => {
			// Vérification que l'utilisateur existe dans la DB
			if (user === null) {
				return res.status(400).json({ message: 'This account does not exists.' });
			}
			// Vérification du mot de passe
			bcrypt
				.compare(req.body.password, user.password)
				.then((testPassword) => {
					// Mot de passe incorrect
					if (!testPassword) {
						return res.status(401).json({ message: 'Wrong password.' });
					}
					// Mot de passe correct : on génere un token pour l'utilisateur
					const token = jwt.sign(
						{
							userId: user._id,
						},
						process.env.JWT_SECRET,
						{ expiresIn: process.env.JWT_DURING }
					);

					return res.json({ userId: user._id, token: token });
				})
				.catch((err) => res.status(500).json(err));
		})
		.catch((err) => res.status(500).json(err));
};

// -------------------------------------
