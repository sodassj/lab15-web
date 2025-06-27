// Importa el modelo Producto definido con Sequelize
const Producto = require('../models/producto');

// Controlador para obtener todos los productos
exports.getAll = async (req, res) => {
  try {
    // Busca todos los registros en la tabla 'producto'
    const productos = await Producto.findAll();
    // Devuelve los productos como respuesta en formato JSON
    res.json(productos);
  } catch (err) {
    // Si ocurre un error, devuelve un estado 500 con el mensaje del error
    res.status(500).json({ error: err.message });
  }
};

// Controlador para obtener un solo producto por su clave primaria (codProducto)
exports.getOne = async (req, res) => {
  try {
    // Busca un producto por su clave primaria usando el parámetro de la URL
    const producto = await Producto.findByPk(req.params.codProducto);
    // Si no existe, responde con 404
    if (!producto) return res.status(404).json({ message: 'No encontrado' });
    // Si lo encuentra, responde con el producto
    res.json(producto);
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Controlador para crear un nuevo producto
exports.create = async (req, res) => {
  try {
    // Crea un nuevo producto con los datos recibidos en el cuerpo de la solicitud
    const nuevo = await Producto.create(req.body);
    // Devuelve el producto creado con estado 201 (creado)
    res.status(201).json(nuevo);
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Controlador para actualizar un producto existente
exports.update = async (req, res) => {
  try {
    // Actualiza el producto con los datos del cuerpo de la solicitud, usando codProducto como criterio
    const actualizado = await Producto.update(req.body, {
      where: { codProducto: req.params.codProducto }
    });
    // actualizado[0] indica cuántos registros fueron modificados
    if (actualizado[0] === 0) return res.status(404).json({ message: 'No encontrado' });
    // Respuesta exitosa
    res.json({ message: 'Actualizado correctamente' });
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Controlador para eliminar un producto
exports.remove = async (req, res) => {
  try {
    // Elimina el producto cuyo codProducto coincida con el parámetro recibido
    const eliminado = await Producto.destroy({
      where: { codProducto: req.params.codProducto }
    });
    // Si no se eliminó ningún registro, significa que no existía
    if (!eliminado) return res.status(404).json({ message: 'No encontrado' });
    // Si se eliminó, responde con estado 204 (sin contenido)
    res.sendStatus(204);
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};
