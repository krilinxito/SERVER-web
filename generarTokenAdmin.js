require('dotenv').config(); // Si estás usando variables de entorno en .env
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Datos que ya tienes del admin
const adminPayload = {
  id: 2, // reemplaza con el id real en tu base de datos
  email: 'barryallen4207@gmail.com', // reemplaza con el email real
  rol: 'admin'
};

const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '1h' });

console.log('Tu token JWT de admin es:\n');
console.log(token);
