const express = require('express');
const app = express();
const db = require('./database');
const port = 3000;

app.use(express.json());

// GET /api/tareas
app.get('/api/tareas', (req, res)=>{
	db.all("SELECT * FROM tareas", (err, rows) => {
		if(err){
			res.status(500).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

// POT /api/tareas
app.post('/api/tareas', (req, res)=>{
	const { titulo, descripcion, fecha_limite, completado  } = req.body;
	
	// Validación básica
	if (!titulo) {
		return res.status(400).json({error: "el título es obligatorio" });
	}

	const query = `INSERT INTO tareas (titulo, descripcion, fecha_limite, completado)
	VALUES (?, ?, ?, ?)`;

	db.run(query, [titulo, descripcion, fecha_limite, completado ? 1: 0], function(err) {
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

app.get('/', (req, res)=>{
	res.send("Hola mundo!");
});

app.listen(port, ()=>{
	console.log(`Escuchando en el puerto: ${port}`);
});
