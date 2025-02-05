exports.seed = function(knex) {
    return knex("productos").del()
      .then(() => {
        return knex("productos").insert([
          { nombre: "Producto 1", descripcion: "Desc 1", precio: 100 },
          { nombre: "Producto 2", descripcion: "Desc 2", precio: 200 }
        ]);
      });
  };
  