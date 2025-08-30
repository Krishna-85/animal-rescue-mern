// backend/src/routes/report.routes.js
import { Router } from "express";
import {
  createReport,
  listReports,
  getReport,
  updateStatus
} from "../controllers/report.controller.js";

import { upload } from "../middlewares/uploadMulter.js"; // Multer instance
import  {uploadFile}  from "../middlewares/upload.js";    // Cloudinary middleware

const reportRoutes = Router();

reportRoutes.get("/", listReports);

// Upload route
reportRoutes.post('/', upload.single('images'), uploadFile, createReport);

reportRoutes.get("/:id", getReport);
reportRoutes.patch("/:id/status", updateStatus);

export default reportRoutes;
