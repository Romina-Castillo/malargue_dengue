const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');  // Importa correctamente el controlador

// Ruta para mostrar el listado de pacientes
router.get('/pacientes', controller.list);

// Ruta para mostrar el formulario de agregar pacientes
router.get('/pacientes/formPaciente', controller.mostrarFormularioPaciente);  // Asegúrate de que esta función esté definida

// Ruta para procesar el formulario de agregar pacientes
router.post('/pacientes/agregar', controller.agregar);

// Ruta para mostrar el formulario de agregar direcciones
router.get('/direcciones/formulario', controller.mostrarFormularioDireccion);

module.exports = router;
