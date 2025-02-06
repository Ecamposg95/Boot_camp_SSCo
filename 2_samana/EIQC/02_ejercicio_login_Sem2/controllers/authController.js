const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/userModel');

const { createUser, getUserByUsername } = require('../models/userModel');

const register = (req, res) => {
    const { username, password, faceData } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: "Error al cifrar la contraseña" });

        createUser({ username, password: hashedPassword, faceData: JSON.stringify(faceData) }, (err, userId) => {
            if (err) return res.status(500).json({ message: "Error al registrar usuario" });

            res.status(201).json({ message: "Usuario registrado con éxito", userId });
        });
    });
};


const login = (req, res) => {
    const { username, password } = req.body;

    db.getUserByUsername(username, (err, user) => {
        if (err || !user) return res.status(404).json({ message: "Usuario no encontrado" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ message: "Credenciales incorrectas" });

            const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '1h' });
            res.json({ message: "Inicio de sesión exitoso", token });
        });
    });
};

const verifyFace = (req, res) => {
    const { username, faceData } = req.body;

    db.getUserByUsername(username, (err, user) => {
        if (err || !user) return res.status(404).json({ message: "Usuario no encontrado" });

        const storedFaceData = new Float32Array(JSON.parse(user.faceData));
        const receivedFaceData = new Float32Array(faceData);
        const distance = Math.sqrt(storedFaceData.reduce((sum, value, i) => sum + Math.pow(value - receivedFaceData[i], 2), 0));

        if (distance < 0.6) {
            return res.json({ message: "Reconocimiento facial exitoso" });
        }
        res.status(401).json({ message: "Reconocimiento facial fallido" });
    });
};
module.exports = { register, login, verifyFace };

