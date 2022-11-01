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

// MODIFICATION D'UNE SAUCE
exports.updateSauce = (req, res) => {
	const sauceId = req.params.id;
	let sauceUpdate;

	Sauce.findById(sauceId)
		.then((sauce) => {
			// Test d'authenticité de l'utilisateur
			if (req.auth.userId !== sauce.userId) {
				return res.status(403).json({ message: 'Forbidden access.' });
			}

			// Si l'image de la sauce est modifié
			if (req.file) {
				// On stocke dans une variable la requête traduite en objet JS + la nouvelle url de l'image
				sauceUpdate = {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
				};

				// Suppression de l'ancienne image stockée
				const oldImgFileName = sauce.imageUrl.split('/images/')[1];
				fs.unlink(`images/${oldImgFileName}`, (errFile) => {
					// On averti la console si la suppression a échoué
					if (errFile) {
						console.log(`/!\ La suppression de l'image a échoué >> ${errFile}`);
					}
				});
			}

			// Si l'image de la sauce n'est pas modifié
			else {
				// On stocke dans une variable la requête (n'a pas besoin d'être traduite)
				sauceUpdate = {
					...req.body,
				};
			}

			// Mise à jour des données dans la DB
			Sauce.updateOne({ _id: sauceId }, { ...sauceUpdate, _id: sauceId })
				.then(() => res.status(201).json({ message: 'Sauce successfully modified.' }))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(500).json(err));
};

// SUPPRESSION D'UNE SAUCE
exports.deleteSauce = (req, res) => {
	const sauceId = req.params.id;
	Sauce.findById(sauceId)
		.then((sauce) => {
			// Test d'authenticité de l'utilisateur
			if (req.auth.userId !== sauce.userId) {
				return res.status(403).json({ message: 'Forbidden access.' });
			}

			// Suppression de l'image stockée
			const imgFileName = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${imgFileName}`, (errFile) => {
				// On averti la console si la suppression a échoué
				if (errFile) {
					console.log(`/!\ La suppression de l'image a échoué >> ${errFile}`);
				}

				// Suppression de la sauce de la DB
				Sauce.deleteOne({ _id: sauceId })
					.then(() => res.status(200).json({ message: 'Sauce successfully removed.' }))
					.catch((err) => res.status(400).json(err));
			});
		})
		.catch((err) => res.status(500).json(err));
};

// LIKE OU DISLIKE D'UNE SAUCE
exports.likeOrDislikeSauce = (req, res) => {
	const sauceId = req.params.id;
	const userId = req.body.userId;
	const likeDislike = req.body.like;

	// Test d'authenticité de l'utilisateur
	if (req.auth.userId !== userId) {
		return res.status(403).json({ message: 'Forbidden access.' });
	}

	// Détection de la sauce liké ou disliké par l'utilisateur
	Sauce.findById(sauceId)
		.then((sauce) => {
			// L'utilisateur a like la sauce
			if (likeDislike === 1) {
				Sauce.findByIdAndUpdate(sauceId, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
					.then(() => res.status(201).json({ message: 'Sauce: like successfully added.' }))
					.catch((err) => res.status(400).json(err));
			}

			// L'utilisateur a dislike la sauce
			if (likeDislike === -1) {
				Sauce.findByIdAndUpdate(sauceId, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
					.then(() => res.status(201).json({ message: 'Sauce: dislike successfully added.' }))
					.catch((err) => res.status(400).json(err));
			}

			// L'utilisateur a annulé son like ou dislike
			if (likeDislike === 0) {
				// Annulation d'un like
				if (sauce.usersLiked.includes(userId)) {
					Sauce.findByIdAndUpdate(sauceId, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
						.then(() => res.status(201).json({ message: 'Sauce: like successfully removed.' }))
						.catch((err) => res.status(400).json(err));
				}

				// Annulation d'un dislike
				else if (sauce.usersDisliked.includes(userId)) {
					Sauce.findByIdAndUpdate(sauceId, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
						.then(() => res.status(201).json({ message: 'Sauce: dislike successfully removed.' }))
						.catch((err) => res.status(400).json(err));
				}

				// Si les deux conditions ne sont pas remplies : erreur
				else {
					res.status(500).json({ message: 'Internal Server Error.' });
				}
			}
		})
		.catch((err) => res.status(500).json(err));
};

// -------------------------------------
