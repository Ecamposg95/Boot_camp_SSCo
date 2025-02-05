const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './data.db', 
    },
    useNullAsDefault: true,
  });
  
  module.exports = knex;
  
  

  async function createDatabase() {
    try {
      const hasTable = await knex.schema.hasTable('productos');
      if (!hasTable) {
        await knex.schema.createTable('productos', (table) => {
          table.increments('id').primary();
          table.string('nombre').notNullable();
          table.decimal('precio', 8, 2).notNullable();
          table.text('descripcion');
          table.timestamps(true, true);
        });
        console.log('La tabla "productos" se ha creado correctamente.');
      } else {
        console.log('La tabla "productos" ya existe.');
      }
    } catch (error) {
      console.error('Error al crear la base de datos o tabla:', error);
    }
  }
  
  createDatabase();
  