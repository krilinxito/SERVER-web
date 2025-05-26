const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Registro y login
router.post('/register', register);
router.post('/login', login);

// Ruta solo para admins
router.get('/admin', verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Bienvenido, admin ${req.user.email}` });
});

module.exports = router;
