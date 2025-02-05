const express = require('express');
const app = express();
const productosRoutes = require('./routes'); // Asegúrate de que sea la ruta correcta
const cors = require('cors');
app.use(cors());  // Esto permite solicitudes de cualquier dominio

app.use(express.json());
app.use('/api', productosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
