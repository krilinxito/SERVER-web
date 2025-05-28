const pool = require('../config/db');

const obtenerResumenDeCaja = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        metodo,
        COALESCE(SUM(monto), 0) AS total_por_metodo
      FROM pagos
      WHERE DATE(hora) = CURDATE()
      GROUP BY metodo
    `);

    // También calculamos el total general del día
    const [totalResult] = await pool.execute(`
      SELECT COALESCE(SUM(monto), 0) AS total_general
      FROM pagos
      WHERE DATE(hora) = CURDATE()
    `);

    return {
      total_general: totalResult[0].total_general || 0,
      por_metodo: rows || []
    };
  } catch (error) {
    throw error;
  }
};
  
module.exports = {
  obtenerResumenDeCaja
};