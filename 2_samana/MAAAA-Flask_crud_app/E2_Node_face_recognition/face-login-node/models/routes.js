const express = require("express");
const multer = require("multer");
const fs = require("fs");
const faceapi = require("face-api.js");
const { Canvas, Image } = require("canvas");
const jwt = require("jsonwebtoken");

const router = express.Router();
const upload = multer({ dest: "dataset/" });

// Cargar modelos de reconocimiento facial
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
}
loadModels();

// Ruta para registrar usuarios
router.post("/register", upload.single("image"), async (req, res) => {
    const { username } = req.body;
    const imagePath = req.file.path;

    // Guardar la imagen en la carpeta dataset
    fs.renameSync(imagePath, `dataset/${username}.png`);

    res.json({ message: "Usuario registrado con éxito." });
});

// Ruta para login con reconocimiento facial
router.post("/login", upload.single("image"), async (req, res) => {
    const imagePath = req.file.path;
    const image = await faceapi.bufferToImage(fs.readFileSync(imagePath));
    
    const users = JSON.parse(fs.readFileSync("encodings.json", "utf-8"));
    let match = null;

    for (const user of users) {
        const userImage = await faceapi.bufferToImage(fs.readFileSync(`dataset/${user.username}.png`));
        const distance = faceapi.euclideanDistance(image.descriptor, userImage.descriptor);
        
        if (distance < 0.6) {
            match = user;
            break;
        }
    }

    if (!match) {
        return res.status(401).json({ message: "No se encontró un usuario con este rostro." });
    }

    const token = jwt.sign({ username: match.username }, "secreto", { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
});

router.post("/register", upload.single("image"), async (req, res) => {
    const { username } = req.body;
    const imagePath = req.file.path;

    // Guardar la imagen en la carpeta dataset
    fs.renameSync(imagePath, `dataset/${username}.png`);

    res.json({ message: "Usuario registrado con éxito." });
});

module.exports = router;

