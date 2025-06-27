// Importa el módulo express
const express = require('express'); 

// Crea una instancia de Router de Express para definir rutas separadas
const router = express.Router();

// Importa el controlador que contiene la lógica para cada operación de producto
const productosController = require('../controllers/productosController');

// Ruta GET / → Obtener todos los productos
router.get('/', productosController.getAll);

// Ruta GET /:codProducto → Obtener un producto por su ID (clave primaria)
router.get('/:codProducto', productosController.getOne);

// Ruta POST / → Crear un nuevo producto
router.post('/', productosController.create);

// Ruta PUT /:codProducto → Actualizar un producto por su ID
router.put('/:codProducto', productosController.update);

// Ruta DELETE /:codProducto → Eliminar un producto por su ID
router.delete('/:codProducto', productosController.remove);

// Exporta el router para usarlo en el archivo principal de rutas o en app.js/server.js
module.exports = router;
