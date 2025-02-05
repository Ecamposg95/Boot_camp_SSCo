// frontend/src/Products.js
import { useEffect, useState } from 'react';
import { fetchProductos, deleteProducto } from './src/api';

const Products = ({ setProductoEdit, refreshProductos }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function loadProductos() {
      setProductos(await fetchProductos());
    }
    loadProductos();
  }, [refreshProductos]);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            <button onClick={() => setProductoEdit(producto)}>Editar</button>
            <button onClick={async () => { await deleteProducto(producto.id); refreshProductos(); }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;

