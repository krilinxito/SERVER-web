const axios = require('axios');

const API_URL = 'https://server-ss1i.onrender.com'; // Tu URL en render.com

async function getToken() {
  try {
    console.log('Intentando login en:', `${API_URL}/auth/login`);
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'barryallen4207@gmail.com',
      password: 'Balack34$'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.token) {
      console.log('\nToken JWT obtenido exitosamente:');
      console.log('\n' + response.data.token + '\n');
      console.log('Para usar este token en tus peticiones, incluye el siguiente header:');
      console.log('Authorization: Bearer ' + response.data.token + '\n');
      
      // También mostrar la información del usuario
      if (response.data.user) {
        console.log('Información del usuario:');
        console.log(JSON.stringify(response.data.user, null, 2));
      }
    } else {
      console.error('No se pudo obtener el token. Respuesta:', response.data);
    }
  } catch (error) {
    console.error('Error al obtener token:');
    if (error.response) {
      // El servidor respondió con un status code fuera del rango 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      console.error(error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
    }
  }
}

getToken(); 