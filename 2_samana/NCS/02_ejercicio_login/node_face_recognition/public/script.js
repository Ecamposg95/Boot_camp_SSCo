// Referencias a los elementos del DOM
const loginSection = document.getElementById("login-section");
const cameraSection = document.getElementById("camera-section");
const userNameInput = document.getElementById("user-name");
const displayName = document.getElementById("display-name");
const loginButton = document.getElementById("login-button");
const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const captureButton = document.getElementById("capture-button");
const registerButton = document.getElementById("register-button");

// Iniciar sesión y mostrar la sección de cámara
loginButton.addEventListener("click", () => {
    const userName = userNameInput.value.trim();
    if (!userName) {
        alert("Por favor, ingrese su nombre.");
        return;
    }

    // Mostrar el nombre del usuario y la sección de la cámara
    displayName.textContent = userName;
    loginSection.classList.add("hidden");
    cameraSection.classList.remove("hidden");

    // Iniciar la cámara
    startCamera();
});

// Iniciar la cámara
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoElement.play();
        console.log("Cámara iniciada correctamente.");
    } catch (error) {
        console.error("Error al acceder a la cámara:", error.message);
        alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.");
    }
}

// Capturar la foto del usuario
captureButton.addEventListener("click", () => {
    const context = canvasElement.getContext("2d");

    // Ajustar el tamaño del canvas al video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Dibujar la imagen del video en el canvas
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Obtener la imagen en formato base64
    const base64Image = canvasElement.toDataURL("image/png");
    console.log("Foto capturada:", base64Image);

    alert("Foto capturada correctamente. Ahora puedes registrarte.");
});

// Registrar la foto y el nombre del usuario
registerButton.addEventListener("click", () => {
    const base64Image = canvasElement.toDataURL("image/png");
    const userName = displayName.textContent;

    if (!base64Image) {
        alert("Por favor, capture una foto antes de registrarse.");
        return;
    }

    // Enviar los datos al servidor o procesarlos
    console.log("Registrando usuario:", userName);
    console.log("Foto en base64:", base64Image);

    alert(`Usuario ${userName} registrado con éxito.`);
});

// Evento del botón "Iniciar Sesión"
registerButton.addEventListener("click", () => {
    const userName = userNameInput.value.trim();

    // Guardar el nombre en localStorage
    localStorage.setItem("userName", userName);

    // Redirigir a la página de bienvenida
    window.location.href = "register.html";
});