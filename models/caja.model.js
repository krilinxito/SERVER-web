const pool = require('../config/db');

// Obtener resumen de pagos del día actual
const obtenerResumenDeCaja = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        metodo,
        SUM(monto) AS total_por_metodo
      FROM pagos
      WHERE DATE(hora) = CURDATE()
      GROUP BY metodo
    `);

    // También calculamos el total general del día
    const [totalResult] = await pool.execute(`
      SELECT SUM(monto) AS total_general
      FROM pagos
      WHERE DATE(hora) = CURDATE()
    `);

    return {
      total_general: totalResult[0].total_general || 0,
      por_metodo: rows
    };
  } catch (error) {
    throw error;
  }
};
  
module.exports = {
  obtenerResumenDeCaja
};
