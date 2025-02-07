const knex = require("knex")(require("./knexfile").development);

// Ruta para registrar usuarios con imágenes faciales
app.post("/register", upload.single("image"), async (req, res) => {
    const { username } = req.body;
    const imagePath = req.file.path;

    await knex("users").insert({ username, imagePath });

    res.json({ message: "Usuario registrado con éxito", username });
});

// Ruta para login con reconocimiento facial
app.post("/login", upload.single("image"), async (req, res) => {
    const imagePath = req.file.path;
    const users = await knex("users").select("*");

    // Aquí se agregará la lógica de reconocimiento facial con face-api.js

    const token = jwt.sign({ username: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
    
});


