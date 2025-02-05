import axios from 'axios';

// Definir la URL base de la API
const API_URL = 'http://localhost:3000/api/productos';

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (producto) => {
  try {
    const response = await axios.post(API_URL, producto);
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};

// Actualizar un producto
export const updateProducto = async (id, producto) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};
