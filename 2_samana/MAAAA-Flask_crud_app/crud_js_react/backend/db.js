// backend/db.js
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './productos.db', // Nombre del archivo de la base de datos
    },
    useNullAsDefault: true,
  });
  
  // Crear la tabla si no existe
  knex.schema.hasTable('productos').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('productos', (table) => {
        table.increments('id').primary();
        table.string('nombre').notNullable();
        table.text('descripcion');
        table.float('precio').notNullable();
      });
    }
  });
  
  module.exports = knex;

  