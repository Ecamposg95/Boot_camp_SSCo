async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    console.log("Modelos de reconocimiento facial cargados");
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadModels();
});

async function captureAndRecognizeFace(username) {
    const webcamContainer = document.querySelector('.webcam');
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });

    video.srcObject = stream;
    video.autoplay = true;
    webcamContainer.innerHTML = '';
    webcamContainer.appendChild(video);

    return new Promise((resolve) => {
        video.onloadedmetadata = async () => {
            setTimeout(async () => {
                const canvas = faceapi.createCanvasFromMedia(video);
                const detections = await faceapi
                    .detectSingleFace(video)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                stream.getTracks().forEach(track => track.stop());
                webcamContainer.innerHTML = ''; 
                if (!detections) {
                    alert("No se detectó un rostro");
                    resolve(null);
                } else {
                    const response = await fetch("/api/auth/verify-face", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username,
                            faceData: Array.from(detections.descriptor)
                        })
                    });
                    const data = await response.json();
                    alert(data.message);
                    resolve(data);
                }
            }, 3000);
        };
    });
}
