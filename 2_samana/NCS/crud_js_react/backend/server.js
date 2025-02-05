require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("knex")(require("./knexfile").development);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/productos", async (req, res) => {
  const productos = await knex("productos").select("*");
  res.json(productos);
});

app.post("/productos", async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  await knex("productos").insert({ nombre, descripcion, precio });
  res.status(201).json({ message: "Producto agregado" });
});

app.put("/productos/:id", async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  await knex("productos").where("id", req.params.id).update({ nombre, descripcion, precio });
  res.json({ message: "Producto actualizado" });
});

app.delete("/productos/:id", async (req, res) => {
  await knex("productos").where("id", req.params.id).del();
  res.json({ message: "Producto eliminado" });
});

app.listen(3001, () => console.log("Servidor en puerto 3001"));
