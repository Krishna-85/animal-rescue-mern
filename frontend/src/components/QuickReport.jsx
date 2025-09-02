// src/components/QuickReport.jsx
import React, { useState, useEffect, useRef } from "react";
import { uploadQuickReport } from "../api/reportApi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map clicks / marker drag
function LocationMarker({ coords, setCoords }) {
  useMapEvents({
    click(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return coords ? (
    <Marker
      position={[coords.lat, coords.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setCoords({ lat: position.lat, lng: position.lng });
        },
      }}
    />
  ) : null;
}

export default function QuickReport() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [desc, setDesc] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fileInputRef = useRef(null);

  // 📍 Get current location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn("Location error:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // 📷 File preview
  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // 📤 Submit form
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!imageFile) return setMsg("⚠️ Please take a photo or choose an image.");
    if (!coords) return setMsg("⚠️ Location not available. Enable GPS.");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("lat", String(coords.lat));
      form.append("lng", String(coords.lng));
      form.append("description", desc || "");
      form.append("images", imageFile, imageFile.name);

      const res = await uploadQuickReport(form);

      if (res?.ok) {
        setMsg("✅ Report submitted — nearby rescue centers notified.");
        setImageFile(null);
        setDesc("");
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMsg("❌ Failed to submit: " + (res?.message || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Error uploading. Check your network or backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <div className="flex items-center gap-3">

      <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded "><a href="/">Admin login</a></button>
      <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"><a href="/admin/dashboard">Requests</a></button>
      </div>
      <h2 className="text-xl font-semibold mb-3">Quick Report — Injured Animal</h2>

      {/* Upload button */}
      {!preview && (
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-500 text-white py-3 rounded"
          >
            📂 Upload / Capture Photo
          </button>
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setImageFile(f);
        }}
        className="hidden"
        ref={fileInputRef}
      />

      {/* Preview */}
      {preview && (
        <div className="mt-2 relative">
          <img src={preview} alt="preview" className="w-full rounded" />
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setPreview(null);
              setMsg("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
          >
            ❌
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="space-y-3 mt-3">
        <textarea
          placeholder="(optional) Short note — e.g. 'Hit by bike, bleeding on left leg'"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
        />

        <div className="text-sm text-gray-600 mb-2">
          {coords ? (
            <div>
              📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          ) : (
            <div>📍 Getting location…</div>
          )}
        </div>

        {/* Map */}
        <div className="h-64 w-full mb-3">
          {coords && (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationMarker coords={coords} setCoords={setCoords} />
            </MapContainer>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !imageFile}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit Report"}
          </button>
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setDesc("");
              setPreview(null);
              setMsg("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="px-3 py-2 border rounded"
          >
            Reset
          </button>
        </div>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}
