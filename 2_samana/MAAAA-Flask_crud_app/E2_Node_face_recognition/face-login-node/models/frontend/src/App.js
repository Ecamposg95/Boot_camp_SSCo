import React, { useState } from "react";
import axios from "axios";
import FaceCapture from "./FaceCapture";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";


function App() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!username || !image) {
      setMessage("Por favor ingresa un nombre de usuario y captura una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("image", dataURLtoBlob(image));

    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error en el registro.");
    }
  };

  const handleLogin = async () => {
    if (!image) {
      setMessage("Captura una imagen para iniciar sesión.");
      return;
    }

    const formData = new FormData();
    formData.append("image", dataURLtoBlob(image));

    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("token", response.data.token);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error en el login.");
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center">Registro/Login con Reconocimiento Facial</h2>
        <input type="text" className="form-control mt-3" placeholder="Nombre de usuario" onChange={(e) => setUsername(e.target.value)} />
        <FaceCapture onCapture={setImage} />
        <button className="btn btn-primary mt-3" onClick={handleRegister}>Registrar</button>
        <button className="btn btn-success mt-3" onClick={handleLogin}>Iniciar Sesión</button>
        <p className="text-center text-danger mt-3">{message}</p>
      </div>
    </div>
  );
}

export default App;


