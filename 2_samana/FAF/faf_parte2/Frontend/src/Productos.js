import React from 'react';

const Productos = ({ productos, eliminarProducto, actualizarProducto }) => {
  return (
    <div>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
            <button onClick={() => actualizarProducto(producto.id, producto)}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
