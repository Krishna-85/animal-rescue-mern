// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuickReport from "./components/QuickReport";
import { AuthProvider } from "./context/AuthContext";
import AddOrg from "../src/components/AddOrg"
import Login from "./pages/Login";
import AdminRequests from "./components/AdminRequests";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <div className="p-4">
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            
            <Route path="/" element={<QuickReport/>} />
           

            {/* Login Route */}
            <Route path="/login" element={<Login/>} />
            


            {/* Super Admin Only */}
            <Route
              path="/add-org"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AddOrg/>
                </ProtectedRoute>
              }
            />

            {/* Admin Only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminRequests />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
