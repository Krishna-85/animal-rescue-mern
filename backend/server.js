import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import orgRoutes from "./src/routes/org.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import rescueRequestRoutes from "./src/routes/rescueRequestRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import AuthRoutes from "./src/routes/auth.js"
import multer from 'multer';

dotenv.config();
connectDB();

const app = express();

// ✅ Fix __dirname for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ["https://animal-rescue-ui.onrender.com","http://localhost:5173"], // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // agar cookies/auth use ho rahi ho
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({});
export const upload = multer({ storage });

// ✅ Static uploads serve
// app.use("/uploads", express.static(path.join(__dirname,  "server",  "src", "uploads")));

app.use("/api/auth", AuthRoutes)
app.use("/api/reports", reportRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/rescue-requests", rescueRequestRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;