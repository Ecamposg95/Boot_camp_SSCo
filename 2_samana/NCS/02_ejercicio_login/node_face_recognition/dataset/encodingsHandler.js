const fs = require("fs");
const path = require("path");
const faceapi = require("face-api.js");
const canvas = require("canvas");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const encodingsFilePath = path.join(__dirname, "../encodings.json");
let labeledDescriptors = [];

// Cargar modelos de Face API
async function loadModels() {
    const modelPath = path.join(__dirname, "../models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    console.log("Modelos cargados.");
}

// Guardar descriptores faciales
function saveEncoding(name, descriptor) {
    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(name, [descriptor]));
    fs.writeFileSync(encodingsFilePath, JSON.stringify(labeledDescriptors, null, 2));
}

// Cargar descriptores faciales existentes
function loadEncodings() {
    try {
        if (fs.existsSync(encodingsFilePath)) {
            const data = JSON.parse(fs.readFileSync(encodingsFilePath, "utf-8"));
            labeledDescriptors = data.map(
                d => new faceapi.LabeledFaceDescriptors(d.label, d.descriptors)
            );
            console.log("Encodings cargados.");
        } else {
            console.log("El archivo encodings.json no existe. Creando uno nuevo.");
            fs.writeFileSync(encodingsFilePath, JSON.stringify([], null, 2));
        }
    } catch (error) {
        console.error("Error cargando encodings:", error.message);
        labeledDescriptors = [];
    }
}


// Procesar imagen para registro o autenticación
async function processImage(imagePath, name, action) {
    const image = await canvas.loadImage(imagePath);
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
        return { success: false, message: "No se detectó ningún rostro." };
    }

    if (action === "register") {
        saveEncoding(name, detection.descriptor);
        return { success: true, message: `Rostro registrado para ${name}.` };
    } else if (action === "login") {
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        return { success: bestMatch.label !== "unknown", message: `Bienvenido, ${bestMatch.label}!` };
    }
}

module.exports = { loadModels, saveEncoding, loadEncodings, processImage };
