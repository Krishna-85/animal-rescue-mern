import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Check, X } from "lucide-react";
import LocationDetails from "./LocationDetails";
const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Rescue requests fetch karna
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem("orgId"); // 👈 yahan se nikaal lo
      if (!orgId) {
        console.error("Organization ID not found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:8000/api/admin/requests/${orgId}`
      );
      setRequests(res.data.data); // kyunki backend me { success, data } aa raha hai
      console.log(res.data)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Accept / Reject action
  const handleAction = async (id, action) => {
    try {
      const orgId = localStorage.getItem("orgId"); // 👈 login ke time save hona chahiye

      if (!orgId) {
        alert("Organization ID not found. Please login again.");
        return;
      }

      const url =
        action === "accept"
          ? `http://localhost:8000/api/admin/requests/${id}/accept/${orgId}`
          : `http://localhost:8000/api/admin/requests/${id}/reject/${orgId}`;

      const res = await axios.put(url);

      alert(res.data.message);

      // refresh requests
      fetchRequests();
    } catch (err) {
      console.error("Error updating request", err);
      alert("Failed to update request.");
    }
  };

  return (
    <div className="p-6">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"><a href="/quick-report">Quick Report</a></button>
      <h2 className="text-2xl font-semibold mb-4">🐄 Rescue Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No rescue requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-4 bg-white shadow rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <img
                  src={req.images[0]}
                  alt="animal"
                  className="w-32 h-32 object-cover rounded-md mb-2"
                />
                <p className="text-gray-700">{req.description}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <a
                      href={`https://www.google.com/maps?q=${req.location?.coordinates?.[1]},${req.location?.coordinates?.[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {req.location?.coordinates?.[1]},{" "}
                      {req.location?.coordinates?.[0]}
                    </a>
                  </div>

                  {/* 👇 Yaha chhota sa leaflet map embed hoga */}
                  {/* <LocationDetails
                    lat={req.location?.coordinates?.[1]}
                    lng={req.location?.coordinates?.[0]}
                  /> */}
                </div>

                <p className="text-sm mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      req.status === "pending"
                        ? "text-yellow-600"
                        : req.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                    }
                  >
                    {req.status}
                  </span>
                </p>
                {req.nearbyGaushala && (
                  <p className="text-xs text-gray-500">
                    Assigned to: {req.nearbyGaushala.name}
                  </p>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => handleAction(req._id, "accept")}
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
