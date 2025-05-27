const {
  agregarPago,
  obtenerPagosDePedido,
  calcularTotalPagado,
  calcularTotalPedido
} = require('../models/pago.model.js');

// Función auxiliar para manejar números de forma segura
const safeNumber = (value) => {
  const num = Number(value || 0);
  return isNaN(num) ? 0 : num;
};

// POST /api/pagos - Agregar un nuevo pago
const agregarPagoController = async (req, res) => {
  try {
    const { id_pedido, monto, metodo } = req.body;

    if (!id_pedido || !monto || !metodo) {
      return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const montoNum = safeNumber(monto);
    if (montoNum <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0.' });
    }

    const pago = await agregarPago(id_pedido, montoNum, metodo);
    const totalPagado = safeNumber(await calcularTotalPagado(id_pedido));
    const totalPedido = safeNumber(await calcularTotalPedido(id_pedido));
    const restante = Math.max(0, totalPedido - totalPagado);

    res.status(201).json({
      mensaje: 'Pago registrado exitosamente.',
      pago,
      total_pagado: totalPagado,
      total_pedido: totalPedido,
      restante
    });
  } catch (error) {
    console.error('Error al agregar el pago:', error);
    res.status(500).json({ error: 'Error al registrar el pago.' });
  }
};

// GET /api/pagos/:id_pedido - Ver todos los pagos de un pedido
const obtenerPagosDePedidoController = async (req, res) => {
  try {
    const { id_pedido } = req.params;

    const pagos = await obtenerPagosDePedido(id_pedido);
    const totalPagado = safeNumber(await calcularTotalPagado(id_pedido));
    const totalPedido = safeNumber(await calcularTotalPedido(id_pedido));
    const restante = Math.max(0, totalPedido - totalPagado);

    res.status(200).json({
      pagos,
      total_pagado: totalPagado,
      total_pedido: totalPedido,
      restante
    });
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'Error al obtener los pagos.' });
  }
};

module.exports = {
  agregarPagoController,
  obtenerPagosDePedidoController
};
