// URL base del backend donde están expuestas las rutas de productos
const BASE_URL = "https://lab15-web-production.up.railway.app/api/productos";

// Obtiene todos los productos (GET /api/productos)
export async function getProductos() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// Obtiene un solo producto por ID (GET /api/productos/:id)
export async function getProducto(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    return null;
  }
}

// Crea un nuevo producto (POST /api/productos)
export async function createProducto(producto) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error al crear producto:", error);
    return null;
  }
}

// Actualiza un producto por ID (PUT /api/productos/:id)
export async function updateProducto(id, producto) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error);
    return null;
  }
}

// Elimina un producto por ID (DELETE /api/productos/:id)
export async function deleteProducto(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  } catch (error) {
    console.error(`Error al eliminar producto ${id}:`, error);
  }
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
