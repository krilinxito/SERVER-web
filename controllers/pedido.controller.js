// controllers/pedido.controller.js
const {
  crearPedido,
  obtenerTodosLosPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido,
  obtenerLosPedidosPorDia
} = require('../models/pedido.model.js');

const { calcularTotalPedido, calcularTotalPagado } = require('../models/pago.model.js');
const { obtenerProductosDePedido } = require('../models/contiene.model.js');

// Función auxiliar para manejar números de forma segura
const safeNumber = (value) => {
  const num = Number(value || 0);
  return isNaN(num) ? 0 : num;
};

// POST /api/pedidos
const crearPedidoController = async (req, res) => {
  const { nombre, id_usuario } = req.body;

  if (!nombre || !id_usuario) {
    return res.status(400).json({ error: 'Nombre e ID de usuario son requeridos' });
  }

  try {
    const pedido = await crearPedido(nombre, id_usuario);
    console.log('Pedido creado:', pedido);
    res.status(201).json({ data: pedido });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

// GET /api/pedidos
// ... existing code ...

// ... existing code ...
const obtenerTodosLosPedidosController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      estado: req.query.estado,
      usuario: req.query.usuario
    };

    const resultado = await obtenerTodosLosPedidos(page, limit, filtros);
    res.json({
      data: resultado.pedidos,
      total: resultado.total
    });
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({
      error: 'Error al obtener los pedidos',
      details: error.message
    });
  }
};
// ... existing code ...

// ... existing code ...

// GET /api/pedidos/pedidos-dia
const obtenerLosPedidosPorDiaController = async (req, res) => {
  try {
    const pedidosBase = await obtenerLosPedidosPorDia();
    console.log('Pedidos del día obtenidos:', pedidosBase);
    
    if (!pedidosBase || pedidosBase.length === 0) {
      console.log('No hay pedidos para el día actual');
      return res.json({ data: pedidosBase });
    }

    res.json({ data: pedidosBase });
  } catch (error) {
    console.error('Error al obtener los pedidos del día:', error);
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
