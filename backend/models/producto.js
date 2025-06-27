// Importa el tipo de datos de Sequelize (STRING, INTEGER, DECIMAL, etc.)
const { DataTypes } = require('sequelize');

// Importa la instancia de conexión a la base de datos desde el archivo db.js o db/index.js
const sequelize = require('../db');

// Define el modelo 'Producto' que se relaciona con la tabla 'producto' en la base de datos
const Producto = sequelize.define('producto', {
  // Columna: codProducto (clave primaria, autoincremental)
  codProducto: {
    type: DataTypes.INTEGER,      // Tipo entero
    primaryKey: true,             // Clave primaria
    autoIncrement: true           // Autoincremental
  },
  // Columna: nomPro (nombre del producto)
  nomPro: {
    type: DataTypes.STRING,       // Tipo cadena de texto
    allowNull: false              // No permite valores nulos
  },
  // Columna: precioProducto
  precioProducto: {
    type: DataTypes.DECIMAL(10, 2), // Tipo decimal con 10 dígitos, 2 después del punto
    allowNull: false                // No permite nulos
  },
  // Columna: stockProducto
  stockProducto: {
    type: DataTypes.INTEGER,      // Tipo entero
    allowNull: false              // No permite nulos
  }
}, {
  // Opciones adicionales
  tableName: 'producto',          // Nombre exacto de la tabla en la base de datos
  timestamps: false               // Desactiva las columnas automáticas 'createdAt' y 'updatedAt'
});

// Exporta el modelo para poder usarlo en otros archivos (ej. controladores o rutas)
module.exports = Producto;
