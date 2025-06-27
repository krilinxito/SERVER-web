const pool = require('../config/db');

// Helper to get the correct timezone for queries
const TZ = 'America/La_Paz';

const getIngresosSemanales = async () => {
  try {
    const query = `
      SELECT 
        DATE(CONVERT_TZ(p.fecha, 'UTC', ?)) as fecha,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY DATE(CONVERT_TZ(p.fecha, 'UTC', ?))
      ORDER BY fecha
    `;
    const [rows] = await pool.query(query, [TZ, TZ, TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosSemanales:', error);
    throw error;
  }
};

const getIngresosPorMetodo = async () => {
  try {
    const query = `
      SELECT 
        pg.metodo,
        COUNT(*) as cantidad,
        SUM(pg.monto) as total
      FROM pagos pg
      JOIN pedidos p ON pg.id_pedido = p.id
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY pg.metodo
    `;
    const [rows] = await pool.query(query, [TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosPorMetodo:', error);
    throw error;
  }
};

const getProductosMasVendidos = async (limite = 10) => {
  try {
    const query = `
      SELECT 
        p.nombre,
        SUM(c.cantidad) as cantidad_total,
        SUM(c.cantidad * p.precio) as ingresos_total
      FROM contiene c
      JOIN productos p ON c.id_producto = p.id
      JOIN pedidos pd ON c.id_pedido = pd.id
      WHERE YEARWEEK(CONVERT_TZ(pd.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
        AND c.anulado = FALSE
      GROUP BY p.id, p.nombre
      HAVING cantidad_total > 0
      ORDER BY cantidad_total DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [TZ, TZ, limite]);
    return rows;
  } catch (error) {
    console.error('Error en getProductosMasVendidos:', error);
    throw error;
  }
};

const getVentasPorHora = async () => {
  try {
    const query = `
      SELECT 
        HOUR(CONVERT_TZ(p.fecha, 'UTC', ?)) as hora,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY HOUR(CONVERT_TZ(p.fecha, 'UTC', ?))
      HAVING total_pedidos > 0
      ORDER BY hora
    `;
    const [rows] = await pool.query(query, [TZ, TZ, TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getVentasPorHora:', error);
    throw error;
  }
};

const getProductosCancelados = async () => {
  try {
    const query = `
      SELECT 
        p.nombre,
        COUNT(DISTINCT pd.id) as veces_cancelado,
        SUM(c.cantidad) as cantidad_total_cancelada,
        SUM(c.cantidad * p.precio) as valor_perdido
      FROM pedidos pd
      JOIN contiene c ON pd.id = c.id_pedido
      JOIN productos p ON c.id_producto = p.id
      WHERE YEARWEEK(CONVERT_TZ(pd.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
        AND (pd.estado = 'cancelado' OR c.anulado = TRUE)
      GROUP BY p.id, p.nombre
      ORDER BY veces_cancelado DESC
    `;
    const [rows] = await pool.query(query, [TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getProductosCancelados:', error);
    throw error;
  }
};

const getRendimientoUsuarios = async () => {
  try {
    const query = `
      SELECT 
        u.nombre as nombre_usuario,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COALESCE(SUM(pg.monto) / NULLIF(COUNT(DISTINCT p.id), 0), 0) as promedio_venta
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.id_usuario
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY u.id, u.nombre
      HAVING total_pedidos > 0
      ORDER BY total_ventas DESC
    `;
    const [rows] = await pool.query(query, [TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getRendimientoUsuarios:', error);
    throw error;
  }
};

const getComparativaSemanal = async () => {
  try {
    // Semana actual
    const queryActual = `
      SELECT 
        'Semana Actual' as periodo,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COUNT(DISTINCT p.id_usuario) as usuarios_activos
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
    `;
    const [semanaActual] = await pool.query(queryActual, [TZ, TZ]);

    // Semana anterior
    const queryAnterior = `
      SELECT 
        'Semana Anterior' as periodo,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COUNT(DISTINCT p.id_usuario) as usuarios_activos
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(DATE_SUB(CONVERT_TZ(NOW(), 'UTC', ?), INTERVAL 1 WEEK), 1)
    `;
    const [semanaAnterior] = await pool.query(queryAnterior, [TZ, TZ]);

    return [...semanaActual, ...semanaAnterior];
  } catch (error) {
    console.error('Error en getComparativaSemanal:', error);
    throw error;
  }
};

const getIngresosHistoricos = async (pagina, limite) => {
  try {
    const offset = (pagina - 1) * limite;
    const query = `
      SELECT 
        DATE(CONVERT_TZ(pedidos.fecha, 'UTC', ?)) AS fecha,
        COALESCE(SUM(pagos.monto), 0) AS total,
        COUNT(DISTINCT pedidos.id) AS total_pedidos
      FROM pedidos
      LEFT JOIN pagos ON pagos.id_pedido = pedidos.id
      GROUP BY DATE(CONVERT_TZ(pedidos.fecha, 'UTC', ?))
      ORDER BY fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [TZ, TZ, parseInt(limite), parseInt(offset)]);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosHistoricos:', error);
    throw error;
  }
};

const getTotalIngresosHistoricos = async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total
      FROM (
        SELECT DATE(CONVERT_TZ(pedidos.fecha, 'UTC', ?)) AS fecha
        FROM pedidos
        GROUP BY DATE(CONVERT_TZ(pedidos.fecha, 'UTC', ?))
      ) AS subquery
    `;
    const [rows] = await pool.query(query, [TZ, TZ]);
    return rows[0].total;
  } catch (error) {
    console.error('Error en getTotalIngresosHistoricos:', error);
    throw error;
  }
};

const getAnalisisCesta = async (limite = 10) => {
  try {
    const query = `
      SELECT
        p1.nombre AS producto_A,
        p2.nombre AS producto_B,
        COUNT(*) AS frecuencia
      FROM contiene c1
      JOIN contiene c2 ON c1.id_pedido = c2.id_pedido AND c1.id_producto < c2.id_producto
      JOIN productos p1 ON c1.id_producto = p1.id
      JOIN productos p2 ON c2.id_producto = p2.id
      JOIN pedidos pd ON c1.id_pedido = pd.id
      WHERE pd.estado = 'cancelado' -- Significa pagado
        AND YEARWEEK(CONVERT_TZ(pd.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY p1.nombre, p2.nombre
      ORDER BY frecuencia DESC
      LIMIT ?;
    `;
    const [rows] = await pool.query(query, [TZ, TZ, limite]);
    return rows;
  } catch (error) {
    console.error('Error en getAnalisisCesta:', error);
    throw error;
  }
};

const getTiempoPromedioCierre = async () => {
  try {
    const query = `
      SELECT
        AVG(TIMESTAMPDIFF(MINUTE, p.fecha, pg.hora)) AS tiempo_promedio_minutos
      FROM pedidos p
      JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.estado = 'cancelado' -- Significa pagado
        AND YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1);
    `;
    const [rows] = await pool.query(query, [TZ, TZ]);
    return rows[0];
  } catch (error) {
    console.error('Error en getTiempoPromedioCierre:', error);
    throw error;
  }
};

const getHorariosPicoIngresos = async () => {
  try {
    const query = `
      SELECT 
        DAYNAME(CONVERT_TZ(pg.hora, 'UTC', ?)) AS dia_semana,
        HOUR(CONVERT_TZ(pg.hora, 'UTC', ?)) AS hora,
        COUNT(DISTINCT pg.id_pedido) as total_pedidos,
        SUM(pg.monto) AS total_ingresos
      FROM pagos pg
      JOIN pedidos p ON pg.id_pedido = p.id
      WHERE p.estado = 'cancelado' -- Significa pagado
        AND YEARWEEK(CONVERT_TZ(p.fecha, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)
      GROUP BY dia_semana, hora
      ORDER BY total_ingresos DESC;
    `;
    const [rows] = await pool.query(query, [TZ, TZ, TZ, TZ]);
    return rows;
  } catch (error) {
    console.error('Error en getHorariosPicoIngresos:', error);
    throw error;
  }
};

module.exports = {
  getIngresosSemanales,
  getIngresosPorMetodo,
  getProductosMasVendidos,
  getVentasPorHora,
  getProductosCancelados,
  getRendimientoUsuarios,
  getComparativaSemanal,
  getIngresosHistoricos,
  getTotalIngresosHistoricos,
  getAnalisisCesta,
  getTiempoPromedioCierre,
  getHorariosPicoIngresos
};