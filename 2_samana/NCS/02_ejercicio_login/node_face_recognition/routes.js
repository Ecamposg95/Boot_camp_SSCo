const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("./dataset/dataset"); // Importar la conexión a la base de datos

// Ruta para registrar un usuario
router.post("/register", (req, res) => {
    const { name, image } = req.body;

    if (!name || !image) {
        return res.status(400).json({ message: "Faltan datos." });
    }

    // Decodificar la imagen Base64 y guardarla como archivo
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const imagePath = path.join(__dirname, "dataset", `${name}-${Date.now()}.png`);

    fs.writeFile(imagePath, base64Data, "base64", (err) => {
        if (err) {
            console.error("Error al guardar la imagen:", err);
            return res.status(500).json({ message: "Error al guardar la imagen." });
        }

        // Insertar los datos del usuario en la base de datos
        const sql = `INSERT INTO users (name, image_path) VALUES (?, ?)`;
        db.run(sql, [name, imagePath], (err) => {
            if (err) {
                console.error("Error al insertar en la base de datos:", err.message);
                return res.status(500).json({ message: "Error al registrar el usuario." });
            }

            res.json({ success: true, message: "Usuario registrado con éxito." });
        });
    });
});

// Ruta para listar usuarios registrados
router.get("/users", (req, res) => {
    const sql = "SELECT id, name, image_path FROM users";

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err.message);
            return res.status(500).json({ message: "Error al obtener los usuarios." });
        }

        res.json({ success: true, users: rows });
    });
});

module.exports = router;
