const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const faceapi = require('@vladmandic/face-api.js');
const canvas = require('canvas');
const uuid = require('uuid'); 

// Cargar modelos antes de usar face-api.js
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
}

loadModels().then(() => console.log('Modelos cargados correctamente'));

// Ruta para el registro de usuario con imagen
router.post('/register', async (req, res) => {
  const { userId, imageData } = req.body;

  if (!userId || !imageData) {
    return res.status(400).json({ error: 'Faltan datos de entrada.' });
  }

  try {
    // Decodificar la imagen base64
    const imageBuffer = Buffer.from(imageData, 'base64');
    const image = await canvas.loadImage(imageBuffer);

    // Detectar rostro y obtener descriptor facial
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

    if (detections.length > 0) {
      const faceDescriptor = detections[0].descriptor;

      // Guardar imagen en la carpeta 'dataset'
      const imageFileName = `${userId}-${uuid.v4()}.jpg`; // Generamos un nombre único para la imagen
      const datasetPath = path.join(__dirname, '/dataset');
      if (!fs.existsSync(datasetPath)) {
        fs.mkdirSync(datasetPath);
      }
      
      const imagePath = path.join(datasetPath, imageFileName); // Usamos el nombre de archivo correcto

      // Guardar imagen en el sistema de archivos
      const out = fs.createWriteStream(imagePath);
      const stream = canvas.createCanvas(image.width, image.height);
      const ctx = stream.getContext('2d');
      ctx.drawImage(image, 0, 0);
      
      // Usamos un promise para garantizar que se complete la escritura antes de enviar la respuesta
      const imageSaved = new Promise((resolve, reject) => {
        out.on('finish', () => {
          resolve(imagePath); 
        });
        out.on('error', (err) => {
          reject(err); 
        });
        stream.pngStream().pipe(out);
      });
      await imageSaved;

      // Agregar un console.log para verificar si la imagen se guarda correctamente
      console.log(`Imagen guardada en: ${imagePath}`);
      let encodings = [];
      if (fs.existsSync('encodings.json')) {
        encodings = JSON.parse(fs.readFileSync('encodings.json'));
      }
      encodings.push({ userId, faceDescriptor, imagePath: imageFileName });
      fs.writeFileSync('encodings.json', JSON.stringify(encodings, null, 2));
      res.json({ message: 'Usuario registrado correctamente.' });
    } else {
      res.status(400).json({ error: 'No se detectó rostro en la imagen.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen.' });
  }
});

// Ruta para el login con reconocimiento facial
router.post('/login', async (req, res) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'Faltan datos de entrada.' });
  }

  try {
    const imageBuffer = Buffer.from(imageData, 'base64');
    const image = await canvas.loadImage(imageBuffer);
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

    if (detections.length > 0) {
      const faceDescriptor = detections[0].descriptor;

      if (fs.existsSync('encodings.json')) {
        const encodings = JSON.parse(fs.readFileSync('encodings.json'));

        let match = false;
        encodings.forEach(item => {
          const savedDescriptor = item.faceDescriptor;
          const distance = faceapi.euclideanDistance(faceDescriptor, savedDescriptor);
          if (distance < 0.6) { 
            match = true;
          }
        });

        if (match) {
          res.json({ message: 'Inicio de sesión exitoso.' });
        } 
      } else {
        res.status(400).json({ error: 'No se encontraron descriptores registrados.' });
      }
    } else {
      res.status(400).json({ error: 'No se detectó rostro en la imagen.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen.' });
  }
});

module.exports = router;
