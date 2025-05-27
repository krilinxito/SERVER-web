require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const pedidosRoutes = require('./routes/pedido.routes');
const contieneRoutes = require('./routes/contiene.routes');
const pagosRoutes = require('./routes/pagos.routes');
const cajaRoutes = require('./routes/caja.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173'], // aquí puedes agregar otros orígenes válidos si los necesitas
  credentials: true, // opcional, si usas cookies
};
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Permite cualquier origen (temporalmente)
}));

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/productos', productRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/contiene', contieneRoutes);
app.use('/pagos', pagosRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/caja', cajaRoutes);
async function testDbConnection() {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  testDbConnection();
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
