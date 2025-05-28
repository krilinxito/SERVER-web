const { obtenerResumenDeCaja } = require('../models/caja.model');

const obtenerResumenDeCajaController = async (req, res) => {
  try {
    const resumenCrudo = await obtenerResumenDeCaja();
    
    // Inicializamos los totales en 0
    const resumenFormateado = {
      totalDia: resumenCrudo.total_general || 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      totalQR: 0,
      totalOnline: 0
    };

    // Procesamos cada método de pago
    resumenCrudo.por_metodo.forEach(item => {
      switch(item.metodo.toLowerCase()) {
        case 'efectivo':
          resumenFormateado.totalEfectivo = Number(item.total_por_metodo) || 0;
          break;
        case 'tarjeta':
          resumenFormateado.totalTarjeta = Number(item.total_por_metodo) || 0;
          break;
        case 'qr':
          resumenFormateado.totalQR = Number(item.total_por_metodo) || 0;
          break;
        case 'online':
          resumenFormateado.totalOnline = Number(item.total_por_metodo) || 0;
          break;
      }
    });

    res.status(200).json(resumenFormateado);
  } catch (error) {
    console.error('Error al obtener el resumen de caja:', error);
    res.status(500).json({ error: 'Error al obtener el resumen de caja' });
  }
};

module.exports = {
  obtenerResumenDeCajaController
};