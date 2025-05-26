const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser, validatePassword } = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;


// Validación de fuerza de contraseña con regex
function validarFuerzaPassword(password) {
  if (!password) return 'débil';
  if (password.length < 6) return 'débil';

  const fuerteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/; 
  const intermediaRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

  if (fuerteRegex.test(password)) return 'fuerte';
  if (intermediaRegex.test(password)) return 'intermedia';
  return 'débil';
}

// Verificar token CAPTCHA con Google
async function verificarCaptcha(token) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;

  try {
    const response = await axios.post(url);
    return response.data.success;
  } catch (error) {
    console.error('Error verificando CAPTCHA:', error);
    return false;
  }
}

async function register(req, res) {
  const { nombre, email, password, captchaToken } = req.body;

  // Verificar CAPTCHA
  const captchaValido = await verificarCaptcha(captchaToken);
  if (!captchaValido) {
    return res.status(400).json({ error: 'CAPTCHA inválido' });
  }

  const fuerza = validarFuerzaPassword(password);
  if (fuerza === 'débil') {
    return res.status(400).json({ error: 'La contraseña es demasiado débil.' });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'El email ya está registrado.' });
  }

  try {
    const userId = await createUser({ nombre, email, password });
    res.status(201).json({ message: 'Usuario creado correctamente', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const validPass = await validatePassword(password, user.password_hash);
  if (!validPass) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol }, 
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login exitoso', token });
}

function zonaAdmin(req, res) {
  res.json({ message: `Bienvenido, admin ${req.user.email}` });
}

module.exports = { register, login, zonaAdmin };