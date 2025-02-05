const db = require('./db');

const seed = async () => {
  try {
    await db('productos').del(); // Borra datos anteriores
    await db('productos').insert([
      { nombre: 'cafe', descripcion: 'Café colombiano', precio: 100 },
      { nombre: 'refresco', descripcion: 'Bebida gaseosa', precio: 150 },
      { nombre: 'galletas', descripcion: 'Galletas de chocolate', precio: 200 },
    ]);
    console.log('Datos de prueba insertados');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    process.exit();
  }
};

seed();
