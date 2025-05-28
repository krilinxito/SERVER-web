const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const JWT_SECRET = process.env.JWT_SECRET;

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Consulta el usuario en la base de datos
    const [rows] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [decoded.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Asignar usuario completo a req.user
    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function soloAdmin(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
}

module.exports = {
  verificarToken,
  soloAdmin,
};