const pool = require('../config/db');

// Crear pedido con mejor manejo de errores
const crearPedido = async (nombre, id_usuario) => {
  try {
    console.log('=== CREAR PEDIDO EN MODELO ===');
    console.log('Datos recibidos:', { nombre, id_usuario });
    console.log('Tipo de datos:', { 
      nombre: typeof nombre, 
      id_usuario: typeof id_usuario 
    });

    // Verificar conexión a la base de datos
    console.log('Verificando conexión a la BD...');
    const [testConnection] = await pool.execute('SELECT 1 as test');
    console.log('Conexión exitosa:', testConnection[0]);

    // Verificar que la tabla existe
    console.log('Verificando estructura de la tabla...');
    const [tableInfo] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'pedidos' AND TABLE_SCHEMA = DATABASE()
    `);
    console.log('Estructura de tabla pedidos:', tableInfo);

    // Verificar que el usuario existe
    console.log('Verificando que el usuario existe...');
    const [userCheck] = await pool.execute(
      'SELECT id, nombre FROM usuarios WHERE id = ?',
      [id_usuario]
    );
    console.log('Usuario encontrado:', userCheck[0]);

    if (userCheck.length === 0) {
      throw new Error(`Usuario con ID ${id_usuario} no existe`);
    }

    // Insertar el pedido
    console.log('Insertando pedido en la BD...');
    const [result] = await pool.execute(
      'INSERT INTO pedidos (nombre, id_usuario, estado) VALUES (?, ?, "pendiente")',
      [nombre, id_usuario]
    );
    
    console.log('Resultado de inserción:', result);
    console.log('ID del pedido creado:', result.insertId);

    // Obtener el pedido recién creado
    console.log('Obteniendo pedido recién creado...');
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

    console.log('Pedido creado exitosamente:', pedido[0]);
    return pedido[0];
  } catch (error) {
    console.error('=== ERROR DETALLADO EN CREAR PEDIDO ===');
    console.error('Mensaje de error:', error.message);
    console.error('Código de error:', error.code);
    console.error('Número de error:', error.errno);
    console.error('Estado SQL:', error.sqlState);
    console.error('Mensaje SQL:', error.sqlMessage);
    console.error('Stack trace:', error.stack);
    
    // Determinar el tipo de error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla pedidos no existe en la base de datos');
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new Error(`El usuario con ID ${id_usuario} no existe en la tabla usuarios`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Error de permisos en la base de datos');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar a la base de datos');
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      throw new Error('Campo no encontrado en la tabla pedidos');
    } else {
      throw new Error(`Error de base de datos: ${error.message}`);
    }
  }
};