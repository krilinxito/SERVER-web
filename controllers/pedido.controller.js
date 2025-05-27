// controllers/pedido.controller.js
const {
  crearPedido,
  obtenerTodosLosPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
  obtenerLosPedidosPorDia
} = require('../models/pedido.model.js');

// POST /api/pedidos
const crearPedidoController = async (req, res) => {
  const { nombre, id_usuario } = req.body;

  if (!nombre || !id_usuario) {
    return res.status(400).json({ error: 'Nombre e ID de usuario son requeridos' });
  }

  try {
    const pedido = await crearPedido(nombre, id_usuario);
    res.status(201).json({ message: 'Pedido creado', pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

// GET /api/pedidos
const obtenerTodosLosPedidosController = async (req, res) => {
  try {
    const pedidos = await obtenerTodosLosPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};
const obtenerLosPedidosPorDiaController = async (req, res) => {
  try {
    const pedidos = await obtenerLosPedidosPorDia();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos del día' });
  }
};

// GET /api/pedidos/:id
const obtenerPedidoPorIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await obtenerPedidoPorId(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

// PUT /api/pedidos/:id
const actualizarPedidoController = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'Nombre es requerido' });
  }

  try {
    const pedidoExistente = await obtenerPedidoPorId(id);
    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedidoActualizado = await actualizarPedido(id, nombre);
    res.json({ message: 'Pedido actualizado', pedido: pedidoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
};

// DELETE /api/pedidos/:id
const eliminarPedidoController = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await obtenerPedidoPorId(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    await eliminarPedido(id);
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
};

module.exports = {
  crearPedidoController,
  obtenerTodosLosPedidosController,
  obtenerPedidoPorIdController,
  actualizarPedidoController,
  eliminarPedidoController,
  obtenerLosPedidosPorDiaController
};
