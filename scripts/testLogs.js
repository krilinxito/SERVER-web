const axios = require('axios');

const API_URL = 'https://server-ss1i.onrender.com';
const TOKEN = ''; // Pega aquí el token que obtuviste del script anterior

async function testLogs() {
  try {
    console.log('Intentando obtener logs de:', `${API_URL}/logs`);
    
    const response = await axios.get(`${API_URL}/logs`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\nRegistros de logs obtenidos:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al obtener logs:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogs(); 