const estadisticasModel = require('../models/estadisticas.model');

const safeController = (controllerFn) => async (req, res) => {
  try {
    await controllerFn(req, res);
  } catch (error) {
    console.error(`Error en ${controllerFn.name}:`, error);
    res.status(500).json({ 
      error: 'Ocurrió un error en el servidor',
      details: error.message 
    });
  }
};

const getTodasLasEstadisticas = safeController(async (req, res) => {
  const estadisticas = {
    ingresosSemanales: estadisticasModel.getIngresosSemanales(),
    ingresosPorMetodo: estadisticasModel.getIngresosPorMetodo(),
    productosMasVendidos: estadisticasModel.getProductosMasVendidos(),
    ventasPorHora: estadisticasModel.getVentasPorHora(),
    productosCancelados: estadisticasModel.getProductosCancelados(),
    rendimientoUsuarios: estadisticasModel.getRendimientoUsuarios(),
    comparativaSemanal: estadisticasModel.getComparativaSemanal(),
    analisisCesta: estadisticasModel.getAnalisisCesta(),
    tiempoPromedioCierre: estadisticasModel.getTiempoPromedioCierre(),
    horariosPicoIngresos: estadisticasModel.getHorariosPicoIngresos(),
  };

  const resultados = {};
  for (const key in estadisticas) {
    resultados[key] = await estadisticas[key];
  }

  res.json(resultados);
});

const getIngresosHistoricos = safeController(async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 10;
  
  const [ingresos, total] = await Promise.all([
    estadisticasModel.getIngresosHistoricos(pagina, limite),
    estadisticasModel.getTotalIngresosHistoricos()
  ]);

  res.json({ ingresos, total, pagina, limite });
});

module.exports = {
  getTodasLasEstadisticas,
  getIngresosHistoricos,
};