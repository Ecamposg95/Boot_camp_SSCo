// frontend/src/ProductForm.js
import { useState, useEffect } from 'react';
import { createProducto, updateProducto } from '../../api';

const ProductForm = ({ productoEdit, setProductoEdit, refreshProductos }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (productoEdit) {
      setNombre(productoEdit.nombre);
      setDescripcion(productoEdit.descripcion);
      setPrecio(productoEdit.precio);
    }
  }, [productoEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const producto = { nombre, descripcion, precio: parseFloat(precio) };

    if (productoEdit) {
      await updateProducto(productoEdit.id, producto);
      setProductoEdit(null);
    } else {
      await createProducto(producto);
    }

    setNombre('');
    setDescripcion('');
    setPrecio('');
    refreshProductos();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      <button type="submit">{productoEdit ? 'Actualizar' : 'Agregar'}</button>
    </form>
  );
};

export default ProductForm;

