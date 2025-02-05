// frontend/src/api.js
const API_URL = 'http://localhost:5000/productos';

// Obtener todos los productos
export async function fetchProductos() {
  const res = await fetch(API_URL);
  return res.json();
}

// Crear un nuevo producto
export async function createProducto(producto) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  return res.json();
}

// Actualizar un producto
export async function updateProducto(id, producto) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  return res.json();
}

// Eliminar un producto
export async function deleteProducto(id)

