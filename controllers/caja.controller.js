const { obtenerResumenDeCaja, obtenerResumenPorFecha } = require('../models/caja.model');

const obtenerResumenDeCajaController = async (req, res) => {
  try {
    const resumenCrudo = await obtenerResumenDeCaja();
    
    // Inicializamos el resumen formateado
    const resumenFormateado = {
      fecha: resumenCrudo.fecha,
      totalDia: resumenCrudo.total_general || 0,
      totalPedidos: resumenCrudo.total_pedidos || 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      totalQR: 0,
      totalOnline: 0,
      detallesPorMetodo: [],
      pagos: resumenCrudo.pagos.map(pago => ({
        id: pago.id,
        idPedido: pago.id_pedido,
        monto: Number(pago.monto),
        metodo: pago.metodo,
        hora: pago.hora,
        estadoPedido: pago.estado_pedido,
        nombrePedido: pago.nombre_pedido,
        nombreUsuario: pago.nombre_usuario
      }))
    };

    // Procesamos cada método de pago
    resumenCrudo.por_metodo.forEach(item => {
      const total = Number(item.total) || 0;
      const detalle = {
        metodo: item.metodo,
        total: total,
        cantidad: item.cantidad,
        porcentaje: resumenFormateado.totalDia > 0 
          ? ((total / resumenFormateado.totalDia) * 100).toFixed(2)
          : 0
      };

      // Actualizamos los totales por método
      switch(item.metodo.toLowerCase()) {
        case 'efectivo':
          resumenFormateado.totalEfectivo = total;
          break;
        case 'tarjeta':
          resumenFormateado.totalTarjeta = total;
          break;
        case 'qr':
          resumenFormateado.totalQR = total;
          break;
        case 'online':
          resumenFormateado.totalOnline = total;
          break;
      }

      resumenFormateado.detallesPorMetodo.push(detalle);
    });

    // Añadimos estadísticas adicionales
    resumenFormateado.estadisticas = {
      promedioPorPedido: resumenFormateado.totalPedidos > 0
        ? resumenFormateado.totalDia / resumenFormateado.totalPedidos
        : 0,
      metodoPagoMasUsado: resumenFormateado.detallesPorMetodo
        .sort((a, b) => b.cantidad - a.cantidad)[0]?.metodo || 'ninguno',
      metodoPagoMayorMonto: resumenFormateado.detallesPorMetodo
        .sort((a, b) => b.total - a.total)[0]?.metodo || 'ninguno'
    };

    res.status(200).json(resumenFormateado);
  } catch (error) {
    console.error('Error al obtener el resumen de caja:', error);
    res.status(500).json({ 
      error: 'Error al obtener el resumen de caja',
      mensaje: error.message 
    });
  }
};

const obtenerResumenPorFechaController = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es requerida' });
    }

    const resumenCrudo = await obtenerResumenPorFecha(fecha);
    
    // Usamos la misma lógica de formateo que en obtenerResumenDeCajaController
    const resumenFormateado = {
      fecha: resumenCrudo.fecha,
      totalDia: resumenCrudo.total_general || 0,
      totalPedidos: resumenCrudo.total_pedidos || 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      totalQR: 0,
      totalOnline: 0,
      detallesPorMetodo: [],
      pagos: resumenCrudo.pagos.map(pago => ({
        id: pago.id,
        idPedido: pago.id_pedido,
        monto: Number(pago.monto),
        metodo: pago.metodo,
        hora: pago.hora,
        estadoPedido: pago.estado_pedido,
        nombrePedido: pago.nombre_pedido,
        nombreUsuario: pago.nombre_usuario
      }))
    };

    // Procesamos cada método de pago
    resumenCrudo.por_metodo.forEach(item => {
      const total = Number(item.total) || 0;
      const detalle = {
        metodo: item.metodo,
        total: total,
        cantidad: item.cantidad,
        porcentaje: resumenFormateado.totalDia > 0 
          ? ((total / resumenFormateado.totalDia) * 100).toFixed(2)
          : 0
      };

      // Actualizamos los totales por método
      switch(item.metodo.toLowerCase()) {
        case 'efectivo':
          resumenFormateado.totalEfectivo = total;
          break;
        case 'tarjeta':
          resumenFormateado.totalTarjeta = total;
          break;
        case 'qr':
          resumenFormateado.totalQR = total;
          break;
        case 'online':
          resumenFormateado.totalOnline = total;
          break;
      }

      resumenFormateado.detallesPorMetodo.push(detalle);
    });

    // Añadimos estadísticas adicionales
    resumenFormateado.estadisticas = {
      promedioPorPedido: resumenFormateado.totalPedidos > 0
        ? resumenFormateado.totalDia / resumenFormateado.totalPedidos
        : 0,
      metodoPagoMasUsado: resumenFormateado.detallesPorMetodo
        .sort((a, b) => b.cantidad - a.cantidad)[0]?.metodo || 'ninguno',
      metodoPagoMayorMonto: resumenFormateado.detallesPorMetodo
        .sort((a, b) => b.total - a.total)[0]?.metodo || 'ninguno'
    };

    res.status(200).json(resumenFormateado);
  } catch (error) {
    console.error('Error al obtener el resumen de caja por fecha:', error);
    res.status(500).json({ 
      error: 'Error al obtener el resumen de caja por fecha',
      mensaje: error.message 
    });
  }
};

module.exports = {
  obtenerResumenDeCajaController,
  obtenerResumenPorFechaController
};