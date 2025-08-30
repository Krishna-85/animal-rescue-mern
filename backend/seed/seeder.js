// backend/seed/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Organization from "../src/models/Organization.js";
import Report from "../src/models/Report.js";
import connectDB from "../src/config/db.js";

dotenv.config();

const orgs = [
  {
    name: "Kanpur Gaushala",
    email: "kanpur@gaushala.org",
    phone: "9876543210",
    address: "Kanpur, UP",
    location: { type: "Point", coordinates: [80.3319, 26.4499] },
    serviceRadiusKm: 15
  },
  {
    name: "Lucknow Animal Rescue",
    email: "lucknow@rescue.org",
    phone: "9123456780",
    address: "Lucknow, UP",
    location: { type: "Point", coordinates: [80.9462, 26.8467] },
    serviceRadiusKm: 20
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Organization.deleteMany();
    await Report.deleteMany();

    await Organization.insertMany(orgs);

    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
