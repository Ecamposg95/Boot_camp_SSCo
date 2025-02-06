const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        faceData TEXT
    )`);
});

const createUser = (userData, callback) => {
    const { username, password, faceData } = userData;

    const sql = `INSERT INTO users (username, password, faceData) VALUES (?, ?, ?)`;
    db.run(sql, [username, password, faceData], function (err) {
        if (err) return callback(err);
        callback(null, this.lastID);
    });
};

const getUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        if (err) return callback(err);
        callback(null, row);
    });
};

module.exports = { db, createUser, getUserByUsername };
