const express = require('express');
const app = express();
const db = require('./database');
const port = 3000;
const bcrypt = require('bcrypt');
const getTareasQuery = `SELECT * FROM tareas
					 WHERE completado = 0
					 ORDER BY id ASC` 

const postTareasQuery = `INSERT INTO tareas (
				titulo, 
				descripcion, 
				fecha_limite, 
				completado
				)
				VALUES (?, ?, ?, ?)`;


app.use(express.json());


// POST /api/tareas
app.post('/api/tareas', (req, res)=>{
	const { titulo, descripcion, fecha_limite, completado  } = req.body;
	
	// Validación básica
	if (!titulo) {
		return res.status(400).json({error: "el título es obligatorio" });
	}

	db.run(postTareasQuery, [titulo, descripcion, 
	fecha_limite, completado ? 1: 0], function(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(201).json({
			id: this.lastID,
			titulo,
			descripcion,
			fecha_limite,
			completado: !!completado
		});
	});
});

// GET /api/tareas
app.get('/api/tareas', (req, res)=> {
	db.all(getTareasQuery, (err, rows) => {
		if(err) {
			res.status(500).json({ error: err.message });
			return;
		}
		// Ordenar tareas por fecha_limite
		rows.sort((a, b)=> {
			if(!a.fecha_limite) return 1;
			if(!b.fecha_limite) return -1;
			return new Date(a.fecha_limite) - new Date(b.fecha_limite);
		});
		
		res.json(rows);
	});
});

// PUT /api/tareas/:id
app.put('/api/tareas/:id', (req, res)=> {
	const id = req.params.id;
	const { titulo, descripcion, fecha_limite } = req.body;
	db.run(`UPDATE tareas SET 
		titulo = COALESCE(?, titulo),
		descripcion = COALESCE(?, descripcion),
		fecha_limite = COALESCE(?, fecha_limite)
		WHERE id = ?`, [titulo, descripcion, fecha_limite, id],
		function(err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			if (this.changes === 0) {
				return res.status(404).json({ message: 
				"Tarea no encontrada"});
			}
			res.json({ message: "Tarea actualizada con éxito", id: id });
			}
	);
});


// DELETE /api/tareas/:id

app.delete('/api/tareas/:id', (req, res)=> {
	const id = req.params.id;
	db.run('DELETE FROM tareas WHERE id = ?', id, function(err){
		if (err) {
		console.error("Error al eliminar la tarea", err);
		res.status(500).json({ error: "Error al eliminar la tarea" });
		} else {
			if (this.changes > 0) {
				res.status(204).end(); 
			} else
			res.status(404).json({ error: "Tarea no encontrada" });
		}
	});
});

// POST /api/registro
app.post('/api/registro', (req, res) => {
	const { usuario, password, email } = req.body;
	try {
		const hashedPassword = bcrypt.hashSync(password, 10); 
	} catch(error) {
		console.error("Error al hashear el password: ", error);
	}
	
	db.run(`INSERT INTO users (usuario, password, email) 
	VALUES (?, ?, ?)`, [usuario, password, email],
		function (err) {
			if (err) {
					return res.status(400).json({ error: err.message });
			}
			res.json({ id: this.lastID, message: `Usuario registrado con éxito` });
		}

	);
});


app.listen(port, ()=>{
	console.log(`Escuchando en el puerto: ${port}`);
});
