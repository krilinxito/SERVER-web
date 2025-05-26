const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function createUser({ nombre, email, password }) {
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, password_hash]
  );
  return result.insertId;
}

async function validatePassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}

module.exports = { getUserByEmail, createUser, validatePassword };
