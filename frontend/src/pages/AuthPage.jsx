// src/pages/AuthPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//  `https://animal-rescue-api.onrender.com/api `

const API_BASE_URL = "http://localhost:8000/api"

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        // 🔹 Login API
        res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
      } else {
        // 🔹 Signup API (new user gets "user" role by default)
        res = await axios.post(`${API_BASE_URL}/auth/signup`, {
          name,
          email,
          password,
        });
      }

      const { token, role, organization } = res.data;

      if (organization?._id) {
        localStorage.setItem("orgId", organization._id);
      }

      // Save user in context
      login({ token, role, organization });

      // 🔹 Redirect based on role
      if (role === "superadmin") navigate("/add-org");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/quick-report"); // normal user → QuickReport page

    } catch (err) {
      console.error(err);
      setError(
        isLogin ? "Invalid email or password" : "Signup failed, try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Signup"}
        </h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
