const pool = require('../config/db');

// Agregar un pago a un pedido
const agregarPago = async (id_pedido, monto, metodo) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO pagos (id_pedido, monto, metodo)
       VALUES (?, ?, ?)`,
      [id_pedido, monto, metodo]
    );

    // Después de insertar el pago, verificar si ya está completo
    await verificarYActualizarEstadoPedido(id_pedido);

    return { id: result.insertId, id_pedido, monto, metodo };
  } catch (error) {
    throw error;
  }
};

// Obtener todos los pagos de un pedido
const obtenerPagosDePedido = async (id_pedido) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM pagos WHERE id_pedido = ?`,
      [id_pedido]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Calcular el total pagado hasta ahora
const calcularTotalPagado = async (id_pedido) => {
  try {
    const [rows] = await pool.execute(
      `SELECT SUM(monto) AS total_pagado FROM pagos WHERE id_pedido = ?`,
      [id_pedido]
    );
    return rows[0].total_pagado || 0;
  } catch (error) {
    throw error;
  }
};

// Calcular el total a pagar (de productos no anulados)
const calcularTotalPedido = async (id_pedido) => {
  try {
    const [rows] = await pool.execute(
      `SELECT SUM(p.precio * c.cantidad) AS total
       FROM contiene c
       JOIN productos p ON c.id_producto = p.id
       WHERE c.id_pedido = ? AND c.anulado = FALSE`,
      [id_pedido]
    );
    return rows[0].total || 0;
  } catch (error) {
    throw error;
  }
};

// Verificar si el pedido ya fue cancelado y actualizar su estado si corresponde
const verificarYActualizarEstadoPedido = async (id_pedido) => {
  const total = await calcularTotalPedido(id_pedido);
  const pagado = await calcularTotalPagado(id_pedido);

  if (pagado >= total && total > 0) {
    await pool.execute(
      `UPDATE pedidos SET estado = 'cancelado' WHERE id = ?`,
      [id_pedido]
    );
  }
};

module.exports = {
  agregarPago,
  obtenerPagosDePedido,
  calcularTotalPagado,
  calcularTotalPedido,
  verificarYActualizarEstadoPedido
};
