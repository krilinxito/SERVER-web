const pool = require('../config/db');

// Agregar producto a un pedido
const agregarProductoAPedido = async (id_pedido, id_producto, cantidad = 1) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO contiene (id_pedido, id_producto, cantidad)
       VALUES (?, ?, ?)`,
      [id_pedido, id_producto, cantidad]
    );
    return { id: result.insertId, id_pedido, id_producto, cantidad };
  } catch (error) {
    throw error;
  }
};

// Anular un producto de un pedido
const anularProductoDePedido = async (id_contiene) => {
  try {
    await pool.execute(
      `UPDATE contiene SET anulado = TRUE WHERE id = ?`,
      [id_contiene]
    );
    return true;
  } catch (error) {
    throw error;
  }
};

// Obtener productos activos de un pedido (para mostrar)
const obtenerProductosDePedido = async (id_pedido) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        c.id,
        c.id_producto,
        c.cantidad,
        c.anulado,
        p.nombre,
        p.precio
       FROM contiene c
       JOIN productos p ON c.id_producto = p.id
       WHERE c.id_pedido = ? AND c.anulado = FALSE`,
      [id_pedido]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  agregarProductoAPedido,
  anularProductoDePedido,
  obtenerProductosDePedido
};
