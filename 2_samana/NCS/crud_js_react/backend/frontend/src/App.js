import React from "react";
import Products from "./Products";
import ProductForm from "./ProductForm";

function App() {
  return (
    <div>
      <h1>CRUD con React y Node.js</h1>
      <ProductForm />
      <Products />
    </div>
  );
}

export default App;
