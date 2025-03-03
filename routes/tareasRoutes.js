const express = require('express');
const router = express.Router(); 
const tareasController = require('../controllers/tareasController');

router.get('/', tareasController.getTareas);
router.post('/', tareasController.postTareas);
router.put('/:id', tareasController.putTareas);
router.delete('/:id', tareasController.deleteTareas);

module.exports = router; 
