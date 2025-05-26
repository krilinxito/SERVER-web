const express = require('express');
const router = express.Router();

const {
  obtenerResumenDeCajaController
} = require('../controllers/caja.controller');

// GET /api/caja/resumen - Obtener resumen de cierre diario
router.get('/resumen', obtenerResumenDeCajaController);

module.exports = router;
