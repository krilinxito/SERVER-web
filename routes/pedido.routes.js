const express = require('express');
const router = express.Router();

const {
  crearPedidoController,
  obtenerTodosLosPedidosController,
  obtenerPedidoPorIdController,
  actualizarPedidoController,
  eliminarPedidoController,
  obtenerLosPedidosPorDiaController
} = require('../controllers/pedido.controller.js');

// Rutas CRUD para pedidos

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', obtenerTodosLosPedidosController);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get('/:id', obtenerPedidoPorIdController);

// POST /api/pedidos - Crear un nuevo pedido
router.post('/', crearPedidoController);

// PUT /api/pedidos/:id - Actualizar un pedido completo
router.put('/:id', actualizarPedidoController);

// DELETE /api/pedidos/:id - Eliminar un pedido
router.delete('/:id', eliminarPedidoController);

router.get('/pedidos-dia', obtenerLosPedidosPorDiaController);

module.exports = router;
