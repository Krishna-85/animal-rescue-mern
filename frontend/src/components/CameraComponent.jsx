import React, { useRef } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Attach stream to video
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startCamera}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Use Camera
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="mt-4 w-80 h-60 border rounded-lg"
      />
    </div>
  );
};

export default CameraComponent;
