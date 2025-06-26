const axios = require('axios');

const API_URL = 'http://localhost:3000';
const EMAIL = 'barryallen4207@gmail.com'; // Cambia esto por tu email
const PASSWORD = 'Balack34$'; // Cambia esto por tu contraseña

async function testAll() {
  try {
    // 1. Obtener token
    console.log('1. Obteniendo token...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    const token = loginResponse.data.token;
    console.log('\nToken obtenido:', token);

    // 2. Obtener logs
    console.log('\n2. Obteniendo logs...');
    const logsResponse = await axios.get(`${API_URL}/logs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\nLogs obtenidos:');
    console.log(JSON.stringify(logsResponse.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAll(); 