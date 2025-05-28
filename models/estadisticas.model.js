const pool = require('../config/db');

const getIngresosSemanales = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(p.fecha) as fecha,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(p.fecha)
      ORDER BY fecha
    `);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosSemanales:', error);
    throw error;
  }
};

const getIngresosPorMetodo = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        pg.metodo,
        COUNT(*) as cantidad,
        SUM(pg.monto) as total
      FROM pagos pg
      JOIN pedidos p ON pg.id_pedido = p.id
      WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY pg.metodo
    `);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosPorMetodo:', error);
    throw error;
  }
};

const getProductosMasVendidos = async (limite = 10) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre,
        SUM(c.cantidad) as cantidad_total,
        SUM(c.cantidad * p.precio) as ingresos_total
      FROM contiene c
      JOIN productos p ON c.id_producto = p.id
      JOIN pedidos pd ON c.id_pedido = pd.id
      WHERE pd.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND c.anulado = FALSE
      GROUP BY p.id, p.nombre
      HAVING cantidad_total > 0
      ORDER BY cantidad_total DESC
      LIMIT ?
    `, [limite]);
    return rows;
  } catch (error) {
    console.error('Error en getProductosMasVendidos:', error);
    throw error;
  }
};

const getVentasPorHora = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        HOUR(p.fecha) as hora,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY HOUR(p.fecha)
      HAVING total_pedidos > 0
      ORDER BY hora
    `);
    return rows;
  } catch (error) {
    console.error('Error en getVentasPorHora:', error);
    throw error;
  }
};

const getProductosCancelados = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre,
        COUNT(DISTINCT pd.id) as veces_cancelado,
        SUM(c.cantidad) as cantidad_total_cancelada,
        SUM(c.cantidad * p.precio) as valor_perdido
      FROM pedidos pd
      JOIN contiene c ON pd.id = c.id_pedido
      JOIN productos p ON c.id_producto = p.id
      WHERE pd.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND (pd.estado = 'cancelado' OR c.anulado = TRUE)
      GROUP BY p.id, p.nombre
      ORDER BY veces_cancelado DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error en getProductosCancelados:', error);
    throw error;
  }
};

const getRendimientoUsuarios = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.nombre as nombre_usuario,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COALESCE(SUM(pg.monto) / NULLIF(COUNT(DISTINCT p.id), 0), 0) as promedio_venta
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.id_usuario
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY u.id, u.nombre
      HAVING total_pedidos > 0
      ORDER BY total_ventas DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error en getRendimientoUsuarios:', error);
    throw error;
  }
};

const getComparativaSemanal = async () => {
  try {
    // Semana actual
    const [semanaActual] = await pool.query(`
      SELECT 
        'Semana Actual' as periodo,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COUNT(DISTINCT p.id_usuario) as usuarios_activos
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    // Semana anterior
    const [semanaAnterior] = await pool.query(`
      SELECT 
        'Semana Anterior' as periodo,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(pg.monto), 0) as total_ventas,
        COUNT(DISTINCT p.id_usuario) as usuarios_activos
      FROM pedidos p
      LEFT JOIN pagos pg ON p.id = pg.id_pedido
      WHERE p.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    return [...semanaActual, ...semanaAnterior];
  } catch (error) {
    console.error('Error en getComparativaSemanal:', error);
    throw error;
  }
};
// ... existing code ...

// Obtener ingresos históricos paginados
// ... existing code ...

// Obtener ingresos históricos paginados
const getIngresosHistoricos = async (pagina, limite) => {
  try {
    const offset = (pagina - 1) * limite;
    const [rows] = await pool.execute(`
      SELECT 
        DATE(pedidos.fecha) AS fecha,
        COALESCE(SUM(pagos.monto), 0) AS total,
        COUNT(DISTINCT pedidos.id) AS total_pedidos
      FROM pedidos
      LEFT JOIN pagos ON pagos.id_pedido = pedidos.id
      GROUP BY DATE(pedidos.fecha)
      ORDER BY fecha DESC
      LIMIT ? OFFSET ?
    `, [Number(limite), Number(offset)]);
    return rows;
  } catch (error) {
    console.error('Error en getIngresosHistoricos:', error);
    throw error;
  }
};

// Obtener total de registros de ingresos históricos
const getTotalIngresosHistoricos = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT COUNT(*) as total FROM (
        SELECT DISTINCT DATE(fecha) as fecha
        FROM pedidos
      ) as fechas_unicas
    `);
    return rows[0].total;
  } catch (error) {
    console.error('Error en getTotalIngresosHistoricos:', error);
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
  getTotalIngresosHistoricos
};