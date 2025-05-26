const { obtenerResumenDeCaja } = require('../models/caja.model');

const obtenerResumenDeCajaController = async (req, res) => {
  try {
    const resumen = await obtenerResumenDeCaja();
    res.status(200).json(resumen);
  } catch (error) {
    console.error('Error al obtener el resumen de caja:', error);
    res.status(500).json({ error: 'Error al obtener el resumen de caja' });
  }
};

module.exports = {
  obtenerResumenDeCajaController
};
