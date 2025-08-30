import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Custom marker icon (fix for empty/transparent marker issue)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationDetails = ({ lat, lng }) => {
  if (!lat || !lng) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded-lg">
        ❌ Location data not available
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-3">
      {/* Coordinates Section */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">📍 Coordinates</h3>
        <p className="text-sm text-gray-600">Latitude: {lat}</p>
        <p className="text-sm text-gray-600">Longitude: {lng}</p>
      </div>

      {/* Map Section */}
      <div className="h-56 w-full rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
              📌 Animal Location <br /> {lat}, {lng}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationDetails;
