import React, { useState, useEffect } from 'react';
import Productos from './Productos';
import ProductosForm from './Productosform';
import axios from 'axios';

const App = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const result = await axios.get('http://localhost:3000/api/productos');
      setProductos(result.data);
    };
    fetchProductos();
  }, []);

  const agregarProducto = async (producto) => {
    await axios.post('http://localhost:3000/api/productos', producto);
    const result = await axios.get('http://localhost:3000/api/productos');
    setProductos(result.data);
  };

  const eliminarProducto = async (id) => {
    await axios.delete(`http://localhost:3000/api/productos/${id}`);
    const result = await axios.get('http://localhost:3000/api/productos');
    setProductos(result.data);
  };

  const actualizarProducto = async (id, producto) => {
    await axios.put(`http://localhost:3000/api/productos/${id}`, producto);
    const result = await axios.get('http://localhost:3000/api/productos');
    setProductos(result.data);
  };

  return (
    <div>
      <h1>Gestión de Productos</h1>
      <ProductosForm agregarProducto={agregarProducto} />
      <Productos
        productos={productos}
        eliminarProducto={eliminarProducto}
        actualizarProducto={actualizarProducto}
      />
    </div>
  );
};

export default App;
