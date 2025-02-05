// frontend/src/App.js
import { useState } from 'react';
import Products from './Products';
import ProductForm from '../../ProductForm';

const App = () => {
  const [productoEdit, setProductoEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>CRUD de Productos</h1>
      <ProductForm productoEdit={productoEdit} setProductoEdit={setProductoEdit} refreshProductos={() => setRefresh(!refresh)} />
      <Products setProductoEdit={setProductoEdit} refreshProductos={() => setRefresh(!refresh)} />
    </div>
  );
};

export default App;

