const express = require('express');
const router = express.Router();
const db = require('./db'); // Importamos la conexión a la base de datos

// Ruta para obtener productos
router.get('/productos', async (req, res) => {
  try {
    const productos = await db('productos').select('*');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// Ruta para crear un producto
router.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  try {
    await db('productos').insert({ nombre, descripcion, precio });
    res.status(201).send('Producto creado');
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Ruta para actualizar un producto
router.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  try {
    await db('productos').where('id', id).update({ nombre, descripcion, precio });
    res.send('Producto actualizado');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db('productos').where('id', id).del();
    res.send('Producto eliminado');
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
