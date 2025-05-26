const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1]; // Formato: "Bearer token"
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Almacenar los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Middleware para verificar si el usuario es admin
function soloAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
}

module.exports = {
  verificarToken,
  soloAdmin,
};
