import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const FaceCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };
    startVideo();
  }, []);

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    onCapture(dataUrl);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={captureImage}>Capturar</button>
      {capturedImage && <img src={capturedImage} alt="captured" />}
    </div>
  );
};

export default FaceCapture;
