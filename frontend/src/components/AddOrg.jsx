import React, { useState } from "react";
import axios from "axios";

export default function AddOrg() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceRadiusKm: 10,
    lat: "",
    lng: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMsg("❌ Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/orgs/add", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        serviceRadiusKm: form.serviceRadiusKm,
        location: {
          type: "Point",
          coordinates: [form.lng, form.lat],
        },
        password: form.password, // 👈 admin password bhi bhejenge
      });

      if (res.data.ok) {
        setMsg("✅ Gaushala & Admin created successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          serviceRadiusKm: 10,
          lat: "",
          lng: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setMsg("❌ Error adding gaushala");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-3">Add New Gaushala</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="serviceRadiusKm" type="number" placeholder="Service Radius (km)" value={form.serviceRadiusKm} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="lat" type="number" placeholder="Latitude" value={form.lat} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="lng" type="number" placeholder="Longitude" value={form.lng} onChange={handleChange} required className="w-full border p-2 rounded" />

        {/* New Password Fields */}
        <input name="password" type="password" placeholder="Admin Password" value={form.password} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="w-full border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded w-full">
          Add Gaushala
        </button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
