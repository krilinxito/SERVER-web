const pool = require('../config/db');

// Crear pedido
const crearPedido = async (nombre, id_usuario) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO pedidos (nombre, id_usuario) VALUES (?, ?)',
      [nombre, id_usuario]
    );
    return { id: result.insertId, nombre, id_usuario };
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

// Obtener pedidos del día actual
const obtenerLosPedidosPorDia = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        p.id,
        p.nombre,
        p.fecha,
        p.estado,
        p.id_usuario,
        u.nombre as nombre_usuario
       FROM pedidos p
       LEFT JOIN usuarios u ON p.id_usuario = u.id
       WHERE DATE(p.fecha) = CURDATE()
       AND p.estado = 'pendiente'
       ORDER BY p.fecha DESC`
    );
    
    // Validación: si no hay pedidos, retornar un array vacío
    if (rows.length === 0) {
      console.log('No hay pedidos registrados para el día de hoy.');
      return [];
    }

    return rows;
  } catch (error) {
    console.error('Error al obtener pedidos del día:', error);
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
  eliminarPedido,
  obtenerLosPedidosPorDia
};