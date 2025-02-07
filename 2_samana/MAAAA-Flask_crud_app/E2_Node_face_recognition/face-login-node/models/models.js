const faceapi = require("face-api.js");
const path = require("path");
const fs = require("fs");

// Importar canvas para trabajar con imágenes en Node.js
const { Canvas, Image, ImageData } = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Ruta donde están los modelos pre-entrenados
const MODELS_PATH = path.join(__dirname, "models");

// Función para cargar modelos de reconocimiento facial
async function loadModels() {
    if (!fs.existsSync(MODELS_PATH)) {
        console.error("❌ Error: La carpeta de modelos no existe. Descarga los modelos de Face-API.js.");
        process.exit(1);
    }

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);

    console.log("✅ Modelos de reconocimiento facial cargados correctamente.");
}

module.exports = { loadModels, faceapi };
