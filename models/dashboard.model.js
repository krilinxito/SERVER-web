const pool = require('../config/db');

// Ingresos totales de los últimos 7 días (por día)
const getIngresosSemanales = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT DATE(pedidos.fecha) AS fecha, SUM(pagos.monto) AS total
      FROM pagos
      JOIN pedidos ON pagos.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
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
      SELECT pagos.metodo, SUM(pagos.monto) AS total
      FROM pagos
      JOIN pedidos ON pagos.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
      GROUP BY pagos.metodo
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Productos más vendidos (top 5 en últimos 7 días)
const getProductosMasVendidos = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT productos.nombre, SUM(contiene.cantidad) AS cantidad_total
      FROM contiene
      JOIN productos ON contiene.id_producto = productos.id
      JOIN pedidos ON contiene.id_pedido = pedidos.id
      WHERE pedidos.fecha >= CURDATE() - INTERVAL 7 DAY
        AND contiene.anulado = FALSE
      GROUP BY productos.id
      ORDER BY cantidad_total DESC
      LIMIT 5
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getIngresosSemanales,
  getIngresosPorMetodo,
  getProductosMasVendidos
};
