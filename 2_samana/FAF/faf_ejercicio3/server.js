const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

const app = express();

// Aumenta el límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));  
app.use(cors({
    origin: 'http://localhost:5000', 
    methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;  

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS faces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      encoding TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
});

const modelsPath = path.join(__dirname, 'models');

async function loadModels() {
    try {
        const modelUrl = 'https://justadudewhohacks.github.io/face-api.js/models/';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
        console.log('Modelos cargados desde la URL correctamente.');
    } catch (error) {
        console.error('Error al cargar los modelos desde la URL:', error);
    }
}

loadModels();

// Ruta para registrar una nueva cara
app.post('/register', (req, res) => {
    const { username, full_name, faceEncoding, image } = req.body;
    console.log("Datos recibidos:", req.body); 

    if (!username || !full_name || !faceEncoding || !image) {
        return res.status(400).json({ message: 'Faltan datos en la solicitud' });
    }

    // Crear usuario en la base de datos
    db.run('INSERT INTO users (username, full_name) VALUES (?, ?)', [username, full_name], function(err) {
        if (err) {
            console.error('Error al registrar usuario:', err.message);
            return res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
        }

        const userId = this.lastID; 

        // Guardar la cara en la base de datos
        db.run('INSERT INTO faces (user_id, encoding) VALUES (?, ?)', [userId, faceEncoding], function(err) {
            if (err) {
                console.error('Error al registrar la cara:', err.message);
                return res.status(500).json({ message: 'Error al registrar la cara', error: err.message });
            }

            // Verificar y guardar la imagen
            const datasetPath = path.join(__dirname, './dataset');
            if (!fs.existsSync(datasetPath)) {
                fs.mkdirSync(datasetPath, { recursive: true });
            }

            const base64Data = image.replace(/^data:image\/png;base64,/, ''); // Eliminar encabezado base64
            const imagePath = path.join(datasetPath, `${username}_${Date.now()}.png`);

            // Guardar la imagen en el disco
            fs.writeFile(imagePath, base64Data, 'base64', (err) => {
                if (err) {
                    console.error('Error al guardar la imagen:', err);
                    return res.status(500).json({ message: 'Error al guardar la imagen', error: err.message });
                }

                console.log('Imagen guardada correctamente en:', imagePath);
                res.status(200).json({ message: 'Registro facial exitoso', userId });
            });
        });
    });
});

// Ruta para obtener los rostros registrados
app.get('/faces', (req, res) => {
  db.all('SELECT * FROM faces', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los rostros', error: err.message });
    }

    res.status(200).json(rows);
  });
});

// Ruta para login
app.post('/login', (req, res) => {
    const { photo, faceDescriptor } = req.body;
    console.log("Datos recibidos para login:", req.body);

    // Convertir el descriptor recibido en un Float32Array
    const descriptorArray = new Float32Array(faceDescriptor);

    // Buscar en la base de datos los usuarios con sus descriptores faciales
    db.all('SELECT * FROM faces INNER JOIN users ON faces.user_id = users.id', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err.message);
            return res.status(500).json({ message: 'Error al obtener los usuarios' });
        }

        // Comparar el descriptor facial recibido con los almacenados en la base de datos
        let userFound = false;
        for (let row of rows) {
            const storedDescriptor = JSON.parse(row.encoding); // Los descriptores en la base de datos
            const storedDescriptorArray = new Float32Array(storedDescriptor);

            const faceMatcher = new faceapi.FaceMatcher(
                [new faceapi.LabeledFaceDescriptors(row.username, [storedDescriptorArray])]);
            
            const bestMatch = faceMatcher.findBestMatch(descriptorArray);

            if (bestMatch.label === row.username) {
                userFound = true;
                res.status(200).json({ success: true, name: row.username });
                break;
            }
        }

        if (!userFound) {
            res.status(400).json({ success: false, message: 'No se encontró una coincidencia' });
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
