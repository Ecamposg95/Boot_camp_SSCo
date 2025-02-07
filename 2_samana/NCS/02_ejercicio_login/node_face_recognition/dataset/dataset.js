const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Ruta a la carpeta dataset y base de datos
const datasetPath = path.join(__dirname, "dataset");
const dbPath = path.join(datasetPath, "users.db");

// Crear la carpeta dataset si no existe
if (!fs.existsSync(datasetPath)) {
    fs.mkdirSync(datasetPath);
    console.log("Carpeta 'dataset' creada.");
}

// Crear o conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conexión exitosa con SQLite.");
    }
});

module.exports = db;
