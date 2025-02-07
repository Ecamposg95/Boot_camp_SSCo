// Función para capturar foto y manejar el registro o login
async function captureAndProcess(isLogin = false) {
    const username = document.getElementById('username').value;
    const fullName = document.getElementById('full_name') ? document.getElementById('full_name').value : null;
  
    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }

    try {
        alert('Capturando foto...');
        const photo = await capturePhoto();
      
        if (!photo) {
            alert('Error al capturar la foto. Intenta nuevamente.');
            return;
        }

        if (isLogin) {
            const result = await recognizeFace(username);  // Aquí se compara con la base de datos
            if (result === 'success') {
                alert('Inicio de sesión exitoso');
                window.location.href = 'home.html';
            } else {
                alert('No se reconoció el rostro. Intenta nuevamente.');
            }
        } else {
            if (!fullName) {
                alert('Por favor ingresa tu nombre completo');
                return;
            }

            const registrationData = { username, full_name: fullName, faceEncoding: photo, image: photo };

            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (response.status === 201) {
                alert('Registro exitoso');
                window.location.href = 'index.html';
            } else {
                alert('Error al registrar el usuario: ' + result.message);
            }
        }
    } catch (err) {
        alert('Error al intentar procesar: ' + err.message);
        console.error('Error al conectar al servidor:', err);
    }
}


  async function login() {
    const photo = captureImage();
    const faceDescriptor = await recognizeFace(photo);

    if (!faceDescriptor) {
        alert("No se detectó un rostro válido.");
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo, faceDescriptor })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = `/success?user_name=${data.name}`;
        } else {
            alert("No se encontró ninguna coincidencia");
        }
    } catch (error) {
        console.error("Error en el login:", error);
    }
}

