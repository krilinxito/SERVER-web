const express = require('express');
const router = express.Router();

const { register, login, zonaAdmin } = require('../controllers/auth.controller');
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware');

// Registro y login
router.post('/register', register);
router.post('/login', login);

// Ruta solo para admins
router.get('/admin', verificarToken, verificarAdmin, zonaAdmin);

module.exports = router;
