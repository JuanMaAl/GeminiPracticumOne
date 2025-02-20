const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(()=>{
	db.run(`CREATE TABLE IF NOT EXISTS tareas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	titulo TEXT NOT NULL,
	descripcion TEXT,
	fecha_limite TEXT,
	completado INTEGER DEFAULT 0
	)`);
});

module.exports= db;

