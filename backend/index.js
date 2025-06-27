// Importa Express para crear el servidor
const express = require('express');

// Importa CORS para permitir peticiones desde otros orígenes (por ejemplo, el frontend)
const cors = require('cors');

// Importa las rutas definidas para productos
const productosRoutes = require('./routes/productosRoutes');

// Importa la instancia de conexión Sequelize a la base de datos
const sequelize = require('./db');

// Crea una aplicación de Express
const app = express();

// Middleware para permitir solicitudes desde otros dominios (evita errores de CORS)
app.use(cors());

// Middleware para poder recibir y procesar datos en formato JSON en las solicitudes
app.use(express.json());

// Asigna el enrutador de productos bajo la ruta base /api/productos
app.use('/api/productos', productosRoutes);

// Sincroniza los modelos Sequelize con la base de datos (crea las tablas si no existen)
sequelize.sync()
  .then(() => {
    // Si la sincronización es exitosa, inicia el servidor en el puerto 3001
    console.log('Base de datos sincronizada');
    app.listen(3001, () => {
      console.log('Backend corriendo en http://localhost:3001');
    });
  })
  .catch(err => {
    // Si ocurre un error al sincronizar con la base de datos, se muestra en consola
    console.error('Error al sincronizar base de datos:', err);
  });
