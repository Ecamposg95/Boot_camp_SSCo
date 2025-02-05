
import React, { useEffect, useState } from "react";
import { getProductos, deleteProducto, updateProducto } from "./api";
import "./style.css";

function Products() {
  const [productos, setProductos] = useState([]);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEditChange = (e, id) => {
    setEditForm({ ...editForm, [id]: { ...editForm[id], [e.target.name]: e.target.value } });
  };

  const handleUpdate = async (id) => {
    try {
      if (!editForm[id]) return;
      await updateProducto(id, editForm[id]);
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((p) => (
          <li key={p.id} className="product-item">
            <input
              name="nombre"
              value={editForm[p.id]?.nombre || p.nombre}
              onChange={(e) => handleEditChange(e, p.id)}
            />
            <input
              name="precio"
              type="number"
              value={editForm[p.id]?.precio || p.precio}
              onChange={(e) => handleEditChange(e, p.id)}
            />
            <button className="update-btn" onClick={() => handleUpdate(p.id)}>Actualizar</button>
            <button className="delete-btn" onClick={() => handleDelete(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
