// routes/auth.routes.js
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();

/**
 * =====================
 * 🔹 User / Admin / Superadmin Login
 * =====================
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check org if user is admin
    const org = await Organization.findOne({ admin: user._id });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, orgId: org?._id || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      organization: org || null,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

/**
 * =====================
 * 🔹 Normal User Signup
 * =====================
 * Anyone can sign up → default role = "user"
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user", // ✅ default role
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      organization: null, // normal user has no org
    });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
});

/**
 * =====================
 * 🔹 Super Admin -> Create Organization + Org Admin
 * =====================
 */
router.post(
  "/create-org",
  authMiddleware(["superadmin"]), // fixed role name
  async (req, res) => {
    try {
      const {
        orgName,
        email,
        phone,
        address,
        serviceRadiusKm,
        lng,
        lat,
        adminName,
        adminEmail,
        adminPassword,
      } = req.body;

      // 🔑 Create Admin User
      const hashed = await bcrypt.hash(adminPassword, 10);
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashed,
        role: "admin",
      });

      // 🏢 Create Organization
      const org = await Organization.create({
        name: orgName,
        email,
        phone,
        address,
        serviceRadiusKm,
        location: { type: "Point", coordinates: [lng, lat] },
        admin: admin._id,
      });

      // Update Admin with orgId
      admin.organization = org._id;
      await admin.save();

      res.json({
        success: true,
        message: "Organization created successfully",
        org,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating organization", error: err.message });
    }
  }
);

export default router;
