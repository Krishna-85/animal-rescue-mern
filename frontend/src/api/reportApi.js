// src/api/reportApi.js
import axios from "axios";
import dotenv from 'dotenv'


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api",
  // Add headers or interceptors here if needed (auth, etc.)
});

export const uploadQuickReport = async (formData) => {
  // formData is a FormData instance
  const res = await API.post("http://localhost:8000/api/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000, // 30s
  });
  return res.data;
};
