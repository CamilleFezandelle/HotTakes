// ------------------------------
// Import des modules nécessaires
// ------------------------------
const jwt = require('jsonwebtoken');

// -------------------
// Extraction du token
// -------------------
const extractBearer = (authorization) => {
	// Test si l'on trouve bien une chaine de caractères
	if (typeof authorization !== 'string') {
		return false;
	}

	// Extraction du token
	const matches = authorization.match(/(bearer)\s+(\S+)/i);

	return matches && matches[2];
};

// ------------------------------
// Test du token de l'utilisateur
// ------------------------------

module.exports = (req, res, next) => {
	// On stock l'extraction du token
	const token = extractBearer(req.headers.authorization);

	// Erreur si le token était incorrect lors de l'extraction
	if (!token) {
		return res.status(400).json({ message: 'Wrong token format.' });
	}

	// Vérification du token
	jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
		// Token invalide : erreur
		if (err) {
			return res.status(401).json(err);
		}

		// Stockage de l'userId du token pour bien authentifier l'utilisateur par la suite
		req.auth = {
			userId: decodedToken.userId,
		};

		// Token valide : on passe à la suite
		next();
	});
};
