const express = require('express');
const app = express();
const db = require('./database');
const port = 3000;
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


// POT /api/tareas
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

// PUT

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

app.listen(port, ()=>{
	console.log(`Escuchando en el puerto: ${port}`);
});
