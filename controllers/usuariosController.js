const db = require('../database');
const bcrypt = require('bcrypt');

// POST /api/registro
const postUsuarios = (req, res) => {
	const { usuario, password, email } = req.body;
	let hashedPassword;
	try {
	    hashedPassword = bcrypt.hashSync(password, 10); 
	} catch(error) {
		console.error("Error al hashear el password: ", error);
	}
	
	db.run(`INSERT INTO users (usuario, password, email) 
	VALUES (?, ?, ?)`, [usuario, hashedPassword, email],
		function (err) {
			if (err) {
					return res.status(400).json({ error: err.message });
			}
			res.json({ id: this.lastID, message: `Usuario registrado con éxito` });
		}

	);
};

module.exports = {
	postUsuarios
};
