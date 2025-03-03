const express = require('express');
const router = express.Router(); 
const usuariosController = require('../controllers/usuariosController');

router.post('/registro', usuariosController.postUsuarios);

module.exports = router; 
