
const pool = require('../config/db');

// Ingresos totales de los últimos 7 días (por día)
const getIngresosSemanales = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        DATE(pedidos.fecha) AS fecha,
        SUM(pagos.monto) AS total,
        COUNT(DISTINCT pedidos.id) AS total_pedidos
      FROM pagos
      JOIN pedidos ON pagos.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND pedidos.estado = 'pendiente'
      GROUP BY DATE(pedidos.fecha)
      ORDER BY fecha ASC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Ingresos por método de pago (últimos 7 días)
const getIngresosPorMetodo = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        pagos.metodo,
        SUM(pagos.monto) AS total,
        COUNT(*) AS cantidad_transacciones,
        AVG(pagos.monto) AS promedio_transaccion
      FROM pagos
      JOIN pedidos ON pagos.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND pedidos.estado = 'pendiente'
      GROUP BY pagos.metodo
      ORDER BY total DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Productos más vendidos (top 10 en últimos 7 días)
const getProductosMasVendidos = async (limite = 10) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        productos.id,
        productos.nombre,
        SUM(contiene.cantidad) AS cantidad_total,
        COUNT(DISTINCT pedidos.id) AS numero_pedidos,
        SUM(contiene.cantidad * productos.precio) AS ingresos_total,
        productos.precio AS precio_actual
      FROM contiene
      JOIN productos ON contiene.id_producto = productos.id
      JOIN pedidos ON contiene.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND pedidos.estado = 'pendiente'
        AND contiene.anulado = FALSE
      GROUP BY productos.id
      ORDER BY cantidad_total DESC
      LIMIT ?
    `, [limite]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Resumen de ventas por hora del día (últimos 7 días)
const getVentasPorHora = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        HOUR(pedidos.fecha) AS hora,
        COUNT(DISTINCT pedidos.id) AS total_pedidos,
        SUM(pagos.monto) AS total_ventas
      FROM pedidos
      JOIN pagos ON pedidos.id = pagos.id_pedido
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND pedidos.estado = 'pendiente'
      GROUP BY HOUR(pedidos.fecha)
      ORDER BY hora ASC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Productos cancelados/anulados (top 5 últimos 7 días)
const getProductosCancelados = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        productos.nombre,
        COUNT(*) AS veces_cancelado,
        SUM(contiene.cantidad) AS cantidad_total_cancelada,
        SUM(contiene.cantidad * productos.precio) AS valor_perdido
      FROM contiene
      JOIN productos ON contiene.id_producto = productos.id
      JOIN pedidos ON contiene.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND (pedidos.estado = 'cancelado' OR contiene.anulado = TRUE)
      GROUP BY productos.id
      ORDER BY veces_cancelado DESC
      LIMIT 5
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Rendimiento por usuario (últimos 7 días)
const getRendimientoUsuarios = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        usuarios.nombre AS nombre_usuario,
        COUNT(DISTINCT pedidos.id) AS total_pedidos,
        SUM(pagos.monto) AS total_ventas,
        AVG(pagos.monto) AS promedio_venta,
        COUNT(DISTINCT CASE WHEN pedidos.estado = 'cancelado' THEN pedidos.id END) AS pedidos_cancelados
      FROM usuarios
      LEFT JOIN pedidos ON usuarios.id = pedidos.id_usuario
      LEFT JOIN pagos ON pedidos.id = pagos.id_pedido
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
      GROUP BY usuarios.id
      ORDER BY total_ventas DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Comparativa con la semana anterior
const getComparativaSemanal = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        CASE 
          WHEN fecha >= CURDATE() - INTERVAL 7 DAY THEN 'Esta semana'
          ELSE 'Semana anterior'
        END AS periodo,
        COUNT(DISTINCT pedidos.id) AS total_pedidos,
        SUM(pagos.monto) AS total_ventas,
        COUNT(DISTINCT pedidos.id_usuario) AS usuarios_activos
      FROM pedidos
      JOIN pagos ON pedidos.id = pagos.id_pedido
      WHERE fecha >= CURDATE() - INTERVAL 14 DAY
        AND pedidos.estado = 'pendiente'
      GROUP BY periodo
      ORDER BY periodo DESC
    `);
    return rows;
  } catch (error) {
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
  getComparativaSemanal
};