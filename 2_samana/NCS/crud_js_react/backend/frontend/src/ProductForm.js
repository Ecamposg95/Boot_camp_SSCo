import React, { useState } from "react";
import { addProducto } from "./api";
import "./style.css";

function ProductForm() {
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProducto(form);
      setForm({ nombre: "", descripcion: "", precio: "" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
      <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default ProductForm;