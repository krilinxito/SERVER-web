const express = require('express');
const router = express.Router();

const {
  ingresosSemanalesController,
  ingresosPorMetodoController,
  productosMasVendidosController
} = require('../controllers/dashboard.controller');

// Middleware de autenticación y autorización si lo tenés implementado
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Estadísticas semanales
router.get('/ingresos-semanales', verificarToken, soloAdmin, ingresosSemanalesController);

// Ingresos por método (efectivo, tarjeta, etc.)
router.get('/ingresos-metodos', verificarToken, soloAdmin, ingresosPorMetodoController);

// Productos más vendidos
router.get('/productos-mas-vendidos', verificarToken, soloAdmin, productosMasVendidosController);

module.exports = router;
