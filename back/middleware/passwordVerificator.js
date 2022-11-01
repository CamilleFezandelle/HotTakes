// ----------------------------------------------------
// Vérification de la syntaxe du mot de passe renseigné
// ----------------------------------------------------
module.exports = (req, res, next) => {
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,22}$/;

	let passwordValidation = regex.test(req.body.password);

	if (passwordValidation) {
		next();
	} else {
		res.status(400).json({ message: 'Password : syntax error !' });
	}
};
