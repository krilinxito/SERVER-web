const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');

const {
  obtenerResumenDeCajaController,
  obtenerResumenPorFechaController
} = require('../controllers/caja.controller');

/**
 * @route GET /api/caja/resumen
 * @description Obtiene el resumen de caja del día actual
 * @access Privado
 * @returns {Object} Resumen de caja con totales, detalles por método y estadísticas
 */
router.get('/resumen', verificarToken, obtenerResumenDeCajaController);

/**
 * @route GET /api/caja/resumen/fecha
 * @description Obtiene el resumen de caja para una fecha específica
 * @access Privado
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Object} Resumen de caja con totales, detalles por método y estadísticas
 */
router.get('/resumen/fecha', verificarToken, obtenerResumenPorFechaController);

module.exports = router;