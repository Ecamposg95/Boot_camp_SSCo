exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable();
      table.string("imagePath").notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("users");
  };
  