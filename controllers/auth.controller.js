const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser, validatePassword } = require('../models/user.model');
const UserLog = require('../models/userLog.model');

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
  // Si no hay RECAPTCHA_SECRET_KEY, omitimos la verificación
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY no está configurada, omitiendo verificación');
    return true;
  }

  // Si no hay token y no hay clave secreta, permitimos el acceso
  if (!token && !RECAPTCHA_SECRET_KEY) {
    return true;
  }

  // Si hay clave secreta pero no hay token, rechazamos
  if (!token && RECAPTCHA_SECRET_KEY) {
    return false;
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;

  try {
    const response = await axios.post(url);
    return response.data.success;
  } catch (error) {
    console.error('Error verificando CAPTCHA:', error);
    // Si hay error de verificación y no es crítico para el ambiente, permitimos el acceso
    return !RECAPTCHA_SECRET_KEY;
  }
}

async function register(req, res) {
  const { nombre, email, password, captchaToken } = req.body;

  try {
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

    const userId = await createUser({ nombre, email, password });
    res.status(201).json({ message: 'Usuario creado correctamente', userId });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

async function login(req, res) {
  const { email, password, captchaToken } = req.body;

  try {
    // Verificar CAPTCHA
    const captchaValido = await verificarCaptcha(captchaToken);
    if (!captchaValido) {
      return res.status(400).json({ error: 'CAPTCHA inválido' });
    }

    // Verificar que existe el usuario
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const validPass = await validatePassword(password, user.password_hash);
    if (!validPass) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar que existe JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET no está configurado');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        nombre: user.nombre,
        rol: user.rol 
      }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Registrar el log de inicio de sesión
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    await UserLog.create(user.id, userAgent, ipAddress);

    // Enviar respuesta exitosa
    return res.json({ 
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}



module.exports = { register, login };