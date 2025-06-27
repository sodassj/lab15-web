  // Importa Express para crear el servidor
  const express = require('express');
  const cors = require('cors');
  const productosRoutes = require('./routes/productosRoutes');
  const sequelize = require('./db');

  require('./models/producto');

  const app = express();

  // Middleware para habilitar CORS y parsear JSON
  app.use(cors());
  app.use(express.json());

  // Ruta base para el API
  app.use('/api/productos', productosRoutes);

  // Puerto dinámico (para Render) o 3001 por defecto
  const PORT = process.env.PORT || 3001;

  // Sincroniza la base de datos y levanta el servidor
  sequelize.sync()
    .then(() => {
      console.log('✅ Base de datos sincronizada');
      app.listen(PORT, () => {
        console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Error al sincronizar base de datos:', err);
    });
