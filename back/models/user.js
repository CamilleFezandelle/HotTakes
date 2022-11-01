// ------------------------------
// Import des modules nécessaires
// ------------------------------
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// ----------------------------
// Création du schéma de 'USER'
// ----------------------------

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// --------------------------------------------------------
// Mise en route du plugin 'Unique Validator' sur le schéma
// --------------------------------------------------------
userSchema.plugin(uniqueValidator);

// --------------------------
// Export du modèle de 'USER'
// --------------------------

module.exports = mongoose.model('users', userSchema);
