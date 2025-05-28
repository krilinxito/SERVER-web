const estadisticasModel = require('../models/estadisticas.model');

// Obtener todas las estadísticas
const getTodasLasEstadisticas = async (req, res) => {
  try {
    const [
      ingresos,
      ingresosPorMetodo,
      productosMasVendidos,
      ventasPorHora,
      productosCancelados,
      rendimientoUsuarios,
      comparativaSemanal
    ] = await Promise.all([
      estadisticasModel.getIngresosSemanales(),
      estadisticasModel.getIngresosPorMetodo(),
      estadisticasModel.getProductosMasVendidos(),
      estadisticasModel.getVentasPorHora(),
      estadisticasModel.getProductosCancelados(),
      estadisticasModel.getRendimientoUsuarios(),
      estadisticasModel.getComparativaSemanal()
    ]);

    res.json({
      ingresos,
      ingresosPorMetodo,
      productosMasVendidos,
      ventasPorHora,
      productosCancelados,
      rendimientoUsuarios,
      comparativaSemanal
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener las estadísticas',
      details: error.message 
    });
  }
};

// Obtener ingresos semanales
const getIngresos = async (req, res) => {
  try {
    const ingresos = await estadisticasModel.getIngresosSemanales();
    res.json(ingresos);
  } catch (error) {
    console.error('Error al obtener ingresos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los ingresos',
      details: error.message 
    });
  }
};

// Obtener ingresos por método de pago
const getIngresosPorMetodo = async (req, res) => {
  try {
    const ingresos = await estadisticasModel.getIngresosPorMetodo();
    res.json(ingresos);
  } catch (error) {
    console.error('Error al obtener ingresos por método:', error);
    res.status(500).json({ 
      error: 'Error al obtener los ingresos por método',
      details: error.message 
    });
  }
};

// Obtener productos más vendidos
const getProductosMasVendidos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10;
    const productos = await estadisticasModel.getProductosMasVendidos(limite);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los productos más vendidos',
      details: error.message 
    });
  }
};

// Obtener ventas por hora
const getVentasPorHora = async (req, res) => {
  try {
    const ventas = await estadisticasModel.getVentasPorHora();
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas por hora:', error);
    res.status(500).json({ 
      error: 'Error al obtener las ventas por hora',
      details: error.message 
    });
  }
};

// Obtener productos cancelados
const getProductosCancelados = async (req, res) => {
  try {
    const productos = await estadisticasModel.getProductosCancelados();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos cancelados:', error);
    res.status(500).json({ 
      error: 'Error al obtener los productos cancelados',
      details: error.message 
    });
  }
};

// Obtener rendimiento de usuarios
const getRendimientoUsuarios = async (req, res) => {
  try {
    const rendimiento = await estadisticasModel.getRendimientoUsuarios();
    res.json(rendimiento);
  } catch (error) {
    console.error('Error al obtener rendimiento de usuarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener el rendimiento de usuarios',
      details: error.message 
    });
  }
};

// Obtener comparativa semanal
const getComparativaSemanal = async (req, res) => {
  try {
    const comparativa = await estadisticasModel.getComparativaSemanal();
    res.json(comparativa);
  } catch (error) {
    console.error('Error al obtener comparativa semanal:', error);
    res.status(500).json({ 
      error: 'Error al obtener la comparativa semanal',
      details: error.message 
    });
  }
};
// ... existing code ...

// Obtener ingresos históricos paginados
const getIngresosHistoricos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    
    const [ingresos, total] = await Promise.all([
      estadisticasModel.getIngresosHistoricos(pagina, limite),
      estadisticasModel.getTotalIngresosHistoricos()
    ]);

    res.json({
      ingresos,
      total,
      pagina,
      limite
    });
  } catch (error) {
    console.error('Error al obtener ingresos históricos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los ingresos históricos',
      details: error.message 
    });
  }
};

module.exports = {
  getTodasLasEstadisticas,
  getIngresos,
  getIngresosPorMetodo,
  getProductosMasVendidos,
  getVentasPorHora,
  getProductosCancelados,
  getRendimientoUsuarios,
  getComparativaSemanal,
  getIngresosHistoricos
};
