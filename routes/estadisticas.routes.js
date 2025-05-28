const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); // Asegúrate de que el middleware esté correctamente importado
const estadisticasController = require('../controllers/estadisticas.controller'); // Asegúrate de que el controlador esté correctamente importado

// Middleware para proteger todas las rutas de estadísticas
router.use(verifyToken);
router.use(isAdmin);

// Ruta para obtener todas las estadísticas en una sola llamada
router.get('/', estadisticasController.getTodasLasEstadisticas);

// Rutas individuales para cada tipo de estadística
router.get('/ingresos', estadisticasController.getIngresos);
router.get('/ingresos-por-metodo', estadisticasController.getIngresosPorMetodo);
router.get('/productos-mas-vendidos', estadisticasController.getProductosMasVendidos);
router.get('/ventas-por-hora', estadisticasController.getVentasPorHora);
router.get('/productos-cancelados', estadisticasController.getProductosCancelados);
router.get('/rendimiento-usuarios', estadisticasController.getRendimientoUsuarios);
router.get('/comparativa-semanal', estadisticasController.getComparativaSemanal);

module.exports = router;