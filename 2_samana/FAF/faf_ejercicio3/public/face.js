// Configuración de la cámara
const video = document.getElementById('video');
const constraints = {
    video: { facingMode: "user", width: 640, height: 480 }
};

// Iniciar la cámara
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
    }
}

// Capturar una foto
async function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');

    // Enviar la imagen al servidor
    try {
        const response = await fetch('http://localhost:5000', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData,
            }),
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
    } catch (err) {
        console.error("Error al enviar la imagen al servidor: ", err);
    }
}

window.onload = startVideo;
