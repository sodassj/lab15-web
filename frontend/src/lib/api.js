// URL base del backend donde están expuestas las rutas de productos
const BASE_URL = 'https://lab15-web-production.up.railway.app/api/productos';

// Obtiene todos los productos (GET /api/productos)
export async function getProductos() {
  const res = await fetch(BASE_URL);      // Hace la solicitud al backend
  return res.json();                      // Devuelve la respuesta como JSON
}

// Obtiene un solo producto por ID (GET /api/productos/:id)
export async function getProducto(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}

// Crea un nuevo producto (POST /api/productos)
export async function createProducto(producto) {
  const res = await fetch(BASE_URL, {
    method: 'POST',                                     // Método HTTP
    headers: { 'Content-Type': 'application/json' },    // Encabezado que indica que se envía JSON
    body: JSON.stringify(producto)                      // Convierte el objeto JS a JSON
  });
  return res.json();
}

// Actualiza un producto por ID (PUT /api/productos/:id)
export async function updateProducto(id, producto) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  return res.json();
}

// Elimina un producto por ID (DELETE /api/productos/:id)
export async function deleteProducto(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
}

// EJEMPLO CON AXIOS

// import axios from 'axios';                // Importa la librería axios para hacer solicitudes HTTP

// const BASE_URL = 'http://localhost:3001/api/productos';

// Obtiene todos los productos
// export async function getProductos() {
//   const res = await axios.get(BASE_URL);  // axios devuelve directamente el JSON como 'data'
//   return res.data;
// }

// Obtiene un producto por ID
// export async function getProducto(id) {
//   const res = await axios.get(`${BASE_URL}/${id}`);
//   return res.data;
// }

// Crea un producto nuevo
// export async function createProducto(producto) {
//   const res = await axios.post(BASE_URL, producto);
//   return res.data;
// }

// Actualiza un producto por ID
// export async function updateProducto(id, producto) {
//   const res = await axios.put(`${BASE_URL}/${id}`, producto);
//   return res.data;
// }

// Elimina un producto por ID
// export async function deleteProducto(id) {
//   await axios.delete(`${BASE_URL}/${id}`);
// }
