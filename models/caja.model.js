const pool = require('../config/db');

const obtenerResumenDeCaja = async () => {
  try {
    // Primero obtenemos los pagos agrupados por método
    const [rows] = await pool.execute(`
      SELECT 
        metodo,
        COALESCE(SUM(monto), 0) AS total_por_metodo,
        COUNT(*) as cantidad_pagos
      FROM pagos p
      WHERE DATE(p.hora - INTERVAL 4 HOUR) = DATE(NOW() - INTERVAL 4 HOUR)
      GROUP BY metodo
    `);

    // Luego obtenemos el total general del día
    const [totalResult] = await pool.execute(`
      SELECT 
        COALESCE(SUM(monto), 0) AS total_general,
        COUNT(DISTINCT id_pedido) as total_pedidos
      FROM pagos
      WHERE DATE(hora - INTERVAL 4 HOUR) = DATE(NOW() - INTERVAL 4 HOUR)
    `);

    // Obtenemos los pagos detallados del día
    const [pagosDetallados] = await pool.execute(`
      SELECT 
        p.id,
        p.id_pedido,
        p.monto,
        p.metodo,
        p.hora,
        ped.estado as estado_pedido,
        ped.nombre as nombre_pedido,
        u.nombre as nombre_usuario
      FROM pagos p
      LEFT JOIN pedidos ped ON p.id_pedido = ped.id
      LEFT JOIN usuarios u ON ped.id_usuario = u.id
      WHERE DATE(p.hora - INTERVAL 4 HOUR) = DATE(NOW() - INTERVAL 4 HOUR)
      ORDER BY p.hora DESC
    `);

    // Procesamos los resultados
    const resumen = {
      fecha: new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' }),
      total_general: totalResult[0].total_general || 0,
      total_pedidos: totalResult[0].total_pedidos || 0,
      por_metodo: rows.map(row => ({
        metodo: row.metodo,
        total: row.total_por_metodo,
        cantidad: row.cantidad_pagos
      })),
      pagos: pagosDetallados.map(pago => ({
        id: pago.id,
        id_pedido: pago.id_pedido,
        monto: pago.monto,
        metodo: pago.metodo,
        hora: pago.hora,
        estado_pedido: pago.estado_pedido,
        nombre_pedido: pago.nombre_pedido,
        nombre_usuario: pago.nombre_usuario
      }))
    };

    return resumen;
  } catch (error) {
    console.error('Error en obtenerResumenDeCaja:', error);
    throw error;
  }
};

const obtenerResumenPorFecha = async (fecha) => {
  try {
    // Convertimos la fecha a formato YYYY-MM-DD
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];

    // Obtenemos los pagos agrupados por método para la fecha específica
    const [rows] = await pool.execute(`
      SELECT 
        metodo,
        COALESCE(SUM(monto), 0) AS total_por_metodo,
        COUNT(*) as cantidad_pagos
      FROM pagos p
      WHERE DATE(p.hora - INTERVAL 4 HOUR) = ?
      GROUP BY metodo
    `, [fechaFormateada]);

    // Obtenemos el total general para la fecha específica
    const [totalResult] = await pool.execute(`
      SELECT 
        COALESCE(SUM(monto), 0) AS total_general,
        COUNT(DISTINCT id_pedido) as total_pedidos
      FROM pagos
      WHERE DATE(hora - INTERVAL 4 HOUR) = ?
    `, [fechaFormateada]);

    // Obtenemos los pagos detallados de la fecha
    const [pagosDetallados] = await pool.execute(`
      SELECT 
        p.id,
        p.id_pedido,
        p.monto,
        p.metodo,
        p.hora,
        ped.estado as estado_pedido,
        ped.nombre as nombre_pedido,
        u.nombre as nombre_usuario
      FROM pagos p
      LEFT JOIN pedidos ped ON p.id_pedido = ped.id
      LEFT JOIN usuarios u ON ped.id_usuario = u.id
      WHERE DATE(p.hora - INTERVAL 4 HOUR) = ?
      ORDER BY p.hora DESC
    `, [fechaFormateada]);

    // Procesamos los resultados
    const resumen = {
      fecha: fechaFormateada,
      total_general: totalResult[0].total_general || 0,
      total_pedidos: totalResult[0].total_pedidos || 0,
      por_metodo: rows.map(row => ({
        metodo: row.metodo,
        total: row.total_por_metodo,
        cantidad: row.cantidad_pagos
      })),
      pagos: pagosDetallados.map(pago => ({
        id: pago.id,
        id_pedido: pago.id_pedido,
        monto: pago.monto,
        metodo: pago.metodo,
        hora: pago.hora,
        estado_pedido: pago.estado_pedido,
        nombre_pedido: pago.nombre_pedido,
        nombre_usuario: pago.nombre_usuario
      }))
    };

    return resumen;
  } catch (error) {
    console.error('Error en obtenerResumenPorFecha:', error);
    throw error;
  }
};

module.exports = {
  obtenerResumenDeCaja,
  obtenerResumenPorFecha
};