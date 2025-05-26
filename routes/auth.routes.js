const express = require('express');
const router = express.Router();

// Importa los controladores y middlewares correctamente
const { register, login } = require('../controllers/auth.controller'); // ✅ Agrega esta línea
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Asegura que esta ruta exista y devuelva la estructura correcta
router.post('/verify-token', verificarToken, (req, res) => {
  res.json({ 
    user: {
      id: req.user.id,
      email: req.user.email,
      nombre: req.user.nombre,
      rol: req.user.rol
    }
  });
});

// Rutas existentes
router.post('/register', register); // ← Ahora register está definido
router.post('/login', login);       // ← login también estará definido

// Ruta de admin
router.get('/admin', verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Bienvenido, admin ${req.user.email}` });
});

module.exports = router;