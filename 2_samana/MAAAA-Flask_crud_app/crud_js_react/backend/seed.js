// backend/seed.js
const knex = require('./db');

async function seedDatabase() {
  await knex('productos').del(); // Eliminar datos previos
  await knex('productos').insert([
    { nombre: 'Laptop', descripcion: 'Laptop de última generación', precio: 1200.99 },
    { nombre: 'Teléfono', descripcion: 'Smartphone con cámara avanzada', precio: 800.50 },
    { nombre: 'Monitor', descripcion: 'Pantalla LED 24 pulgadas', precio: 199.99 },
  ]);
  console.log('Base de datos inicializada con datos de prueba');
  process.exit(); // Salir del script después de insertar
}

seedDatabase().catch((err) => console.error(err));

