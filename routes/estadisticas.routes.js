const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');
const estadisticasController = require('../controllers/estadisticas.controller');

// Aplicar los middlewares en secuencia
router.use(verificarToken);  // Primero verifica el token y establece req.user
router.use(soloAdmin);      // Luego verifica si es admin usando req.user

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