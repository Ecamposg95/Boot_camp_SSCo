const db = require("../dataset");

const UserModel = {
    // Crear la tabla (por si no existe)
    createTable: () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image_path TEXT NOT NULL
            )
        `;
        db.run(sql, (err) => {
            if (err) {
                console.error("Error al crear la tabla users:", err.message);
            } else {
                console.log("Tabla 'users' lista.");
            }
        });
    },

    // Guardar un nuevo usuario
    saveUser: (name, imagePath, callback) => {
        const sql = `INSERT INTO users (name, image_path) VALUES (?, ?)`;
        db.run(sql, [name, imagePath], (err) => {
            callback(err);
        });
    },

    // Obtener todos los usuarios
    getAllUsers: (callback) => {
        const sql = `SELECT id, name, image_path FROM users`;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },
};

module.exports = UserModel;
