const pool = require('../config/db');

// Crear pedido
const crearPedido = async (nombre, id_usuario) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO pedidos (nombre, id_usuario, estado) VALUES (?, ?, "pendiente")',
      [nombre, id_usuario]
    );
    
    // Obtener el pedido recién creado
    const [pedido] = await pool.execute(
      `SELECT 
        p.id, 
        p.nombre, 
        p.fecha, 
        p.estado,
        p.id_usuario,
        u.nombre as nombre_usuario
       FROM pedidos p
       LEFT JOIN usuarios u ON p.id_usuario = u.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    console.log('Pedido creado en la BD:', pedido[0]);
    return pedido[0];
  } catch (error) {
    console.error('Error en crearPedido:', error);
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
    const query = `
      SELECT 
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
      ORDER BY p.fecha DESC
    `;

    console.log('Ejecutando query:', query);
    const [rows] = await pool.execute(query);
    console.log('Resultados de la query:', rows);

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