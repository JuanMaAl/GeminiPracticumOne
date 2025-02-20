const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(()=>{
	db.run(`CREATE TABLE IF NO EXISTS tareas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	titulo TEXT NOT NULL,
	descripcion TEXT,
	completado INTEGER DEFAULT 0,
	)`);
});

module.exports= db;

