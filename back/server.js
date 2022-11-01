// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

// -----------------------
// Initialisation de l'API
// -----------------------
app.use(cors());
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));

// ------------------
// START SERVER + DB
// ------------------
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log(`MongoDB > connection successful !`))
	.then(() =>
		app.listen(process.env.SERVER_PORT, () => {
			console.log(`This server running on port ${process.env.SERVER_PORT}.`);
		})
	)
	.catch(() => console.log(`Server connection failed !`));
