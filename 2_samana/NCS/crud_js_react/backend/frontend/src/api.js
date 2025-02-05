import axios from "axios";

const API_URL = "http://localhost:3001/productos";

export const getProductos = () => axios.get(API_URL);
export const addProducto = (data) => axios.post(API_URL, data);
export const updateProducto = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteProducto = (id) => axios.delete(`${API_URL}/${id}`);
