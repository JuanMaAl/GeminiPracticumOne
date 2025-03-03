const express = require('express');
const app = express();
const port = 3000;
const tareasRoutes = require('./routes/tareasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes'); 

app.use(express.json());
app.use('/api/tareas', tareasRoutes);
app.use('/api', usuariosRoutes);

app.listen(port, ()=>{
	console.log(`Escuchando en el puerto: ${port}`);
});
