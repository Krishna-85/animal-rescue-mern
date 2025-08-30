import React, { useRef, useState } from "react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Camera start
 const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // rear camera
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    console.warn("Rear camera not found, switching to front:", err);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" } // fallback: front camera
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }
};


  // Capture photo
  const capturePhoto = () => {
    const width = 400;
    const height = 300;
    let video = videoRef.current;
    let canvas = canvasRef.current;

    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      // create File
      const file = new File([blob], `captured-${Date.now()}.png`, {
        type: "image/png",
      });

      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // 👇 parent ko file bhejna ho to callback call karo
      if (onCapture) onCapture(file);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-80 h-60 bg-black"
      ></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div className="mt-3 flex gap-3">
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Capture
        </button>
      </div>

      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Captured Photo:</h3>
          <img
            src={preview}
            alt="captured"
            className="w-80 mt-2 rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
