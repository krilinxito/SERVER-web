const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware'); // Asegúrate de importar el middleware

// Añade esta nueva ruta
router.post('/verify-token', verificarToken, (req, res) => {
  res.json({ 
    user: req.user // El middleware verificarToken debe adjuntar el usuario decodificado
  });
});

// Rutas existentes
router.post('/register', register);
router.post('/login', login);
router.get('/admin', verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Bienvenido, admin ${req.user.email}` });
});

module.exports = router;