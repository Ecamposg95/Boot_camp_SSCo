import React, { useState } from 'react';

const ProductosForm = ({ agregarProducto }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarProducto({ nombre, descripcion, precio });
    setNombre('');
    setDescripcion('');
    setPrecio('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <input
        type="number"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
      />
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default ProductosForm;
