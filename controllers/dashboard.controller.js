const {
  getIngresosSemanales,
  getIngresosPorMetodo,
  getProductosMasVendidos
} = require('../models/dashboard.model.js');

// Ingresos por día en los últimos 7 días
const ingresosSemanalesController = async (req, res) => {
  try {
    const data = await getIngresosSemanales();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en ingresos semanales:', error);
    res.status(500).json({ mensaje: 'Error al obtener ingresos semanales' });
  }
};

// Ingresos por método en los últimos 7 días
const ingresosPorMetodoController = async (req, res) => {
  try {
    const data = await getIngresosPorMetodo();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en ingresos por método:', error);
    res.status(500).json({ mensaje: 'Error al obtener ingresos por método' });
  }
};

// Productos más vendidos
const productosMasVendidosController = async (req, res) => {
  try {
    const data = await getProductosMasVendidos();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos más vendidos' });
  }
};

module.exports = {
  ingresosSemanalesController,
  ingresosPorMetodoController,
  productosMasVendidosController
};
