const pool = require('../config/db');

// Crear pedido
const crearPedido = async (nombre, precio) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO pedidos (nombre) VALUES (?)',
      [nombre]
    );
    return { id: result.insertId, nombre };
  } catch (error) {
    throw error;
  }
};

// Obtener todos los pedidos
const obtenerTodosLosPedidos = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pedidos');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener pedido por ID
const obtenerPedidoPorId = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Actualizar pedido
const actualizarPedido = async (id, nombre) => {
  try {
    await pool.execute(
      'UPDATE pedidos SET nombre = ? WHERE id = ?',
      [nombre, id]
    );
    return { id, nombre };
  } catch (error) {
    throw error;
  }
};

// Eliminar pedido
const eliminarPedido = async (id) => {
  try {
    await pool.execute('DELETE FROM pedidos WHERE id = ?', [id]);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearPedido,
  obtenerTodosLosPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido    
};