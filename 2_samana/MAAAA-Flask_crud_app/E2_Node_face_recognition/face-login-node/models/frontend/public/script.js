const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const message = document.getElementById("message");

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Error al acceder a la cámara", err));

function captureImage() {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

async function register() {
    captureImage();
    const username = document.getElementById("username").value;
    if (!username) {
        message.innerText = "Por favor ingresa un nombre de usuario.";
        return;
    }

    const image = canvas.toDataURL("image/png");

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, image })
    });

    const data = await response.json();
    message.innerText = data.message;
}
