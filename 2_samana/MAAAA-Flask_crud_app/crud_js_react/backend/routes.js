// backend/routes.js
const express = require('express');
const knex = require('./db');

const router = express.Router();

// Obtener todos los productos
router.get('/productos', async (req, res) => {
  const productos = await knex('productos').select('*');
  res.json(productos);
});

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const [id] = await knex('productos').insert({ nombre, descripcion, precio });
  res.json({ id, nombre, descripcion, precio });
});

// Modificar un producto existente
router.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  await knex('productos').where({ id }).update({ nombre, descripcion, precio });
  res.json({ message: 'Producto actualizado' });
});

// Eliminar un producto
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  await knex('productos').where({ id }).del();
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;

