// -----------------------------------------------
// Vérification de la syntaxe de l'email renseigné
// -----------------------------------------------
module.exports = (req, res, next) => {
	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/;

	let emailValidation = regex.test(req.body.email);

	if (emailValidation) {
		next();
	} else {
		res.status(400).json({ message: 'Email : syntax error !' });
	}
};
