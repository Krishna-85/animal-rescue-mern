import { Router } from "express";
import {
  createReport,
  listReports,
  getReport,
  updateStatus
} from "../controllers/report.controller.js";
import { upload } from "../middlewares/upload.js";

const reportRoutes = Router();

reportRoutes.get("/", listReports);

reportRoutes.post("/", upload.array("images", 4), createReport);

reportRoutes.get("/:id", getReport);


reportRoutes.patch("/:id/status", updateStatus);
export default reportRoutes;
