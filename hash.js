const bcrypt = require('bcrypt');

const password = 'Balack34$'; // cámbiala por la que quieras
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generando hash:', err);
    return;
  }

  console.log('Hash generado:');
  console.log(hash);
});
